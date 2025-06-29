import transporter from "../config/mail.config.js"
import { ENVIRONMENT } from "../environment.js"
import userRepository from "../repositories/users.repository.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Temporary storage for pending verifications (in production, use Redis or database)
const pendingVerifications = new Map()

// Cleanup expired verifications every hour
setInterval(() => {
    const now = new Date()
    for (const [email, data] of pendingVerifications.entries()) {
        if (now > data.expiresAt) {
            pendingVerifications.delete(email)
            console.log(`Cleaned up expired verification for: ${email}`)
        }
    }
}, 60 * 60 * 1000) // Run every hour

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

//Recibir datos de consulta y emitir respuestas
class UserController {
    async register(request, response) {
        
        try {
            console.log("hola adentro")
            /* Validamos que llegen los datos */
            if (!request.body || !request.body.name || !request.body.password || !request.body.email) {
                response.status(400).send({
                    message: 'Invalid registration request',
                    ok: false
                })
                return
            }

            // Check if user already exists
            const existingUser = await userRepository.findByEmail({email: request.body.email})
            if (existingUser) {
                response.status(400).send({
                    message: 'User with this email already exists',
                    ok: false
                })
                return
            }

            //Hashear la contraseña
            const password_hashed = await bcrypt.hash(request.body.password, 12)
            console.log(password_hashed)
            
            // Store user data temporarily instead of creating in DB
            const userData = {
                name: request.body.name,
                password: password_hashed,
                email: request.body.email,
                created_at: new Date()
            }
        
            /* Emitimos un token con cierta firma */
            const verification_token = jwt.sign({ email: request.body.email }, ENVIRONMENT.JWT_SECRET_KEY || "clave_super_secreta123_nadie_la_conoce")

            // Store pending verification data
            pendingVerifications.set(request.body.email, {
                userData,
                token: verification_token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            })

            // Send verification email
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
        } catch (error) {
            console.log("Hubo un error", error);
            if (error.status) {
                response.status(error.status).json({
                message: error.message,
                ok: false,
                });
                return;
            } else {
                response
                .status(500)
                .json({ message: "Error interno del servidor", ok: false });
            }
        }
    }
    async getAll(request, response) {

    }

    async verify(request, response) {
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
                //Return para cortar la ejecucion de la funcion
                return
            }
            //Verify intententara ver si la firma es correcta, en caso de no ser correcta emitira (throw) un error
            const contenido = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY || "clave_super_secreta123_nadie_la_conoce")

            console.log({ contenido })
            
            // Check if verification data exists and is not expired
            const pendingData = pendingVerifications.get(contenido.email)
            if (!pendingData) {
                response.status(400).send({
                    ok: false,
                    message: "Verification data not found or expired"
                })
                return
            }
            
            if (new Date() > pendingData.expiresAt) {
                pendingVerifications.delete(contenido.email)
                response.status(400).send({
                    ok: false,
                    message: "Verification token has expired"
                })
                return
            }
            
            // Create the user in the database with verified status
            await userRepository.create({
                ...pendingData.userData,
                verified: true
            })
            
            // Remove from pending verifications
            pendingVerifications.delete(contenido.email)

            response.send({
                ok: true,
                message: 'User validated and created successfully'
            })
            
            
        }
        catch (error) {
            console.log('There was an error', error)
            if(error.status){ //check if the error is mine
                response.status(error.status).send(
                    {
                        message: error.message, 
                        ok: false
                    }
                )
                return // stop executing
            }
            else{
                response.status(500).send({message: 'Internal sever error', ok: false})
            }
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
            
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('There was an error', error)
                response.status(500).send({message: 'Internal server error', ok: false})
            }
        }
    }
    // GET /api/users/resendmail-verification-mail
    // body: {email}
    // Debe re-enviar el mail de verificacion si no esta verificado
    async resendVerificationEmail (request, response){
         try{
            const {email} = request.body
            
            // Check if user already exists and is verified
            const existingUser = await userRepository.findByEmail({email})
            if(existingUser && existingUser.verified){
                throw {
                    status: 400,
                    message: 'User already verified.'
                }
            }
            
            // Check if there's pending verification data
            const pendingData = pendingVerifications.get(email)
            if(!pendingData){
                throw{
                    status: 404,
                    message: 'No pending verification found for this email'
                }
            }
            
            // Check if verification has expired
            if (new Date() > pendingData.expiresAt) {
                pendingVerifications.delete(email)
                throw {
                    status: 400,
                    message: 'Verification has expired. Please register again.'
                }
            }
            
            //Create a new verification token to generate the verification URL 
            const verification_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY || "clave_super_secreta123_nadie_la_conoce")
            
            // Update the pending verification with new token
            pendingVerifications.set(email, {
                ...pendingData,
                token: verification_token
            })
            
            await sendVerificationEmail({
                email, 
                name: pendingData.userData.name, 
                redirect_url:  `http://localhost:3000/api/users/verify?verify_token=${verification_token}`
            })

            //If everything goes well, respond with a success code
            response.send({
                ok: true,
                message: 'Mail resent successfully',
                status: 200
            })
            return
        }
        catch(error){
            
            if(error.status){ 
                response.status(error.status).send(
                    {
                        message: error.message, 
                        ok: false
                    }
                )
                return 
            }
            else{
                console.log('There was an error', error)
                response.status(500).send({message: 'Internal server error', ok: false})
            }
        }
    }

    // Helper function for testing - manually verify a user
    async manualVerify(request, response) {
        try {
            const { email } = request.body
            
            if (!email) {
                response.status(400).send({
                    ok: false,
                    message: "Email is required"
                })
                return
            }
            
            // Check if there's pending verification data
            const pendingData = pendingVerifications.get(email)
            if (!pendingData) {
                response.status(404).send({
                    ok: false,
                    message: "No pending verification found for this email"
                })
                return
            }
            
            // Create the user in the database with verified status
            await userRepository.create({
                ...pendingData.userData,
                verified: true
            })
            
            // Remove from pending verifications
            pendingVerifications.delete(email)

            response.send({
                ok: true,
                message: 'User manually verified and created successfully'
            })
            
        } catch (error) {
            console.log('There was an error', error)
            response.status(500).send({message: 'Internal server error', ok: false})
        }
    }

}

const userController = new UserController()

export default userController