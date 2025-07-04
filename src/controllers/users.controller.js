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
                Please click on the following link to verify your account. If you do no recognize this requesty you can ignore this email.
            </p>
            <a href='${redirect_url}'>Click here to verify your account</a>
            <span>You have 7 days to click the link</span>
            `
        }
    )
    console.log('Mail sent:', result)
}

//Receive the data from the client and validates it
class UserController {
    async register(request, response) {

        /* Validate that all the data arrived */
        if (!request.body || !request.body.name || !request.body.password || !request.body.email) {
            response.status(400).send({
                message: 'Invalid user registration',
                ok: false
            })

        }

        //Hash the password
        const password_hashed = await bcrypt.hash(request.body.password, 12)

        try {
            console.log('[UserController] Attempting to create user:', request.body.email)
            //Save the user in the DB
            const savedUser = await userRepository.create({
                name: request.body.name,
                password: password_hashed,
                email: request.body.email
            })
            console.log('[UserController] User created successfully:', savedUser)

            /* Emit a token with signature */
            const verification_token = jwt.sign({ email: request.body.email }, ENVIRONMENT.JWT_SECRET_KEY)

            await sendVerificationEmail(
                {
                    email: request.body.email,
                    name: request.body.name,
                    redirect_url: `${ENVIRONMENT.URL_API}/api/users/verify?verify_token=${verification_token}`
                }
            )

            response.send({
                message: 'Received!!, Check your email for verification',
                ok: true
            })
        } catch (error) {
            console.error('[UserController] Error during user registration:', error)
            response.status(500).send({
                message: 'Error registering user',
                ok: false,
                error: error.message || error
            })
        }
    }
    async getAll(request, response) {

    }

    async verify(request, response, next) {
        try {

            //Necesitamos capturar el parametro de consulta verify_token
            const verification_token = request.query.verify_token

            //1. Verify the token was the one you emitted & exists 
            if (!verification_token) {
                response.status(400).send(
                    {
                        ok: false,
                        message: "Where is the verification token? 👻👻"
                    }
                )
                return
            }

            //1. Verify the token
            const contenido = jwt.verify(verification_token, "clave_super_secreta123_nadie_la_conoce")

            console.log({ contenido })
            //2. Search for the user by email in the DB 
            //3. See if the user was previously verified
            //4. If 3 fails, change the user from not-verificado to verified
            await userRepository.verifyUserEmail({email: contenido.email})

            response.send({
                status: 200,
                ok: true,
                message: 'User successfully verified'
            })
            
            
        }
        catch (error) {
            next(error)
        }
    }

    async login(request, response, next){
        try{
        
            const {email, password} = request.body

            if(!email){
                throw {status: 400, message: 'No email entered'}
            }
            if(!password){
                throw {status: 400, message: 'No password enetered'}
            }
            
            //1.1: Search for the user in the DB by email
            const user = await userRepository.findByEmail({email: email})
            if(!user){
                throw {status: 404, message: 'User not found'}
            }

            //1.2: Verify email
            if(!user.verified){
                throw {status: 400, message: "Validate your email first"}
            }
            
            //2: Verify if the password that the client passed matches the one in the DB
            const is_same_password = await bcrypt.compare(password, user.password)
            if(!is_same_password){
                throw {status: 400, message: 'Incorrect password'}
            }

            //3: Create a token with non-sensitive user data (sesion)
            const authorization_token = jwt.sign({
                name: user.name,
                email: user.email,
                id: user._id,
                created_at: user.created_at
            }, 
            ENVIRONMENT.JWT_SECRET_KEY
            )
            //4: Responder with the token
            response.status(200).send({
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
    // GET /api/users/resend-verification-mail
    // Resend the verification email if the user is not verified

    async resendVerificationEmail (request, response){
        try{
            const {email} = request.body

            //Search the DB for the user by email
            const user = await userRepository.findByEmail({email})
            //Check that the user exists
            if(!user){
                throw {
                    status: 404,
                    message: 'Usar not found'
                }
            }

            if(user.verified){
                throw {
                    status: 400,
                    message: 'User is already verified'
                }
            }
            //Create a verification token to generate the verification URL 
            const verification_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY)
            await sendVerificationEmail({
                email, 
                name: user.name, 
                redirect_url:  `http://localhost:3000/api/users/verify?verify_token=${verification_token}`
            })

            //If everything goes well resond with the success code
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

}

const userController = new UserController()

export default userController