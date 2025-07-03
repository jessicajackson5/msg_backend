import transporter from "../config/mail.config.js"
import { ENVIRONMENT } from "../environment.js"
import userRepository from "../repositories/users.repository.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const sendVerificationEmail = async ({ email, name, redirect_url }) => {
    const result = await transporter.sendMail(
        {
            from: ENVIRONMENT.GMAIL_USERNAME,
            to: email,
            subject: "Verify your email",
            html: `
            <h1>Welcome ${name}</h1>
            <p>
                To verify your email account, click on the following link or ignore this email.
            </p>
            <a href='${redirect_url}'>Click here to verify</a>
            <span>You have 7 days to click on the link.</span>
            `
        }
    )
    console.log('Mail sent:', result)
}

//Receive request data and emit answers 
class UserController {
    async register(request, response) {
        /* Validate that the data arrived */
        if (!request.body || !request.body.name || !request.body.password || !request.body.email) {
            response.status(400).send({
                message: 'Invalid registration request',
                ok: false
            })
        }

        //Hashear la contraseña
        const password_hashed = await bcrypt.hash(request.body.password, 12)            
        
        // Store user data temporarily instead of creating in DB
        await userRepository.create({
            name: request.body.name,
            password: password_hashed,
            email: request.body.email
        })
        /* Send a signed token */
        const verification_token = jwt.sign({ email: request.body.email }, ENVIRONMENT.JWT_SECRET_KEY)

        // Store pending verification data
        await sendVerificationEmail(
            { 
                email: request.body.email, 
                name: request.body.name, 
                redirect_url: `http://localhost:3000/api/users/verify?verify_token=${verification_token}`
            }
        )   
        
        response.send({
            message: 'Registration initiated! Please check your email to verify your account.',
            ok: true
        })
    } 
    async getAll(request, response) {

    }
    async verify(request, response, next) {
        try {

            //Necesitamos capturar el parametro de consulta verify_token
            const verification_token = request.query.verify_token

            //Primero necesito verificar que el token lo emiti yo y que hay token
            if (!verification_token) {
                response.status(400).send(
                    {
                        ok: false,
                        message: "Where is the verification token? 👻👻"
                    }
                )
                //Return to stop executing
                return
            }
            //Verify intententara ver si la firma es correcta, en caso de no ser correcta emitira (throw) un error
            const contenido = jwt.verify(verification_token, "clave_super_secreta123_nadie_la_conoce")

            console.log({ contenido })
            await userRepository.verifyUserEmail({email: contenido.email})
            response.send({
                ok: true,
                message: 'User validated successfully'
            })
            
            
        }
        catch (error) {
            next(error)
        }

    }

    async login(request, response){
        try{
            const {email, password} = request.body

            if(!email){
                throw {status: 400, message: 'No email entered'}
            }
            if(!password){
                throw {status: 400, message: 'No password entered'}
            }
            
            // Find the user in the DB by email 
            const user = await userRepository.findByEmail({email: email})
            if(!user){
                throw {status: 404, message: 'User not found'}
            }

            // Verify their email is valid
            if(!user.verified){
                throw {status: 400, message: "Validate your email first"}
            }
            
            //Verify if the password entered by the user coincides with the pw for that emmail in the db 
            const is_same_password = await bcrypt.compare(password, user.password)
            if(!is_same_password){
                throw {status: 400, message: 'Invalid password'}
            }

            //Create a token with the non-sensitive user data (session)
            const authorization_token = jwt.sign({
                name: user.name,
                email: user.email,
                id: user._id,
                created_at: user.created_at
            }, 
            ENVIRONMENT.JWT_SECRET_KEY
            )
            // Responder with the token
            response.send({
                ok: true,
                status: 200,
                message: 'User logged in',
                data: {
                    authorization_token: authorization_token
                }
            })
        }
        catch(error){
            next(error)
        }
    }
    // GET /api/users/resendmail-verification-mail
    // body: {email}
    // Debe re-enviar el mail de verificacion si no esta verificado
    async resendVerificationEmail (request, response){
         try{
            const {email} = request.body
            // Check if user already exists and is verified
            const user = await userRepository.findByEmail({email})
            if(!user) {
                throw {
                    status: 400,
                    message: 'User not found'
                }
            }

            if(user.verified){
                throw {
                    status: 400,
                    message: 'The user is already verified'
                }
            }
            //const is_same_password
            //Creamos un token de verificacion para generar la URL de verificacion
            const verification_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY)
            await sendVerificationEmail({
                email, 
                name: user.name, 
                redirect_url:  `http://localhost:3000/api/users/verify?verify_token=${verification_token}`
            })

            //Si todo sale bien respondemos con codigo exitoso
            response.send({
                ok: true,
                message: 'Mail resent successfully',
                status: 200
            })
            return
        }
        catch(error){
           next(error)
        }
    }

}

const userController = new UserController()

export default userController