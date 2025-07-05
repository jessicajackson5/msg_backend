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
            <h1>Welcom ${name}</h1>
            <p>
                Please click on the following link to verify your account. If you do no recognize this request, you can ignore this email.
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

        /* Validate that the data arrived */
        if (!request.body || !request.body.name || !request.body.password || !request.body.email) {
            response.status(400).send({
                message: 'Invalid user registration',
                ok: false
            })

        }

        //Hash the password
        const password_hashed = await bcrypt.hash(request.body.password, 12)


        //Save the user the DB
        await userRepository.create({
            name: request.body.name,
            password: password_hashed,
            email: request.body.email
        })

        // Emit a signed token 
        const verification_token = jwt.sign({ email: request.body.email }, ENVIRONMENT.JWT_SECRET_KEY)

        await sendVerificationEmail(
            {
                email: request.body.email,
                name: request.body.name,
                redirect_url: `${ENVIRONMENT.URL_API}/api/users/verify?verify_token=${verification_token}`
            }
        )

        response.send({
            message: 'Received! A verification email was sent to you',
            ok: true
        })
    }
    async getAll(request, response) {

    }

    async verify(request, response, next) {
        try {

            //Capture the request paramaters from the verification token
            const verification_token = request.query.verify_token

            //First verify that the token exists and that I emitted it
            if (!verification_token) {
                response.status(400).send(
                    {
                        ok: false,
                        message: "Where is the verification token? 👻👻"
                    }
                )
                //Return to stop the execution function
                return
            }
            //1. Verify if the signature is correct or throw an error
            const contenido = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

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
                throw {status: 400, message: 'No email entered.'}
            }
            if(!password){
                throw {status: 400, message: 'No password entered.'}
            }
            
            //1.1: Search for the user in the DB by email
            const user = await userRepository.findByEmail({email: email})
            if(!user){
                throw {status: 404, message: 'User not found'}
            }

            //1.2: Verify email
            if(!user.verified){
                throw {status: 400, message: "First validate your email."}
            }
            
            //2: Verify if the password that the client passed matches the one in the DB
            const is_same_password = await bcrypt.compare(password, user.password)
            if(!is_same_password){
                throw {status: 400, message: 'Invalid password'}
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
                message: 'User logged in successfully',
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
    // body: {email}
    // Resend the verification email if they're not verified

    async resendVerificationEmail (request, response){
        try{
            const {email} = request.body

            //Search the DB for the user by email
            const user = await userRepository.findByEmail({email})
            //Check that the user exists
            if(!user){
                throw {
                    status: 404,
                    message: 'User not found'
                }
            }

            if(user.verified){
                throw {
                    status: 400,
                    message: 'User already verified'
                }
            }
            //Create a verification token to generate the URL verification 
            const verification_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY)
            await sendVerificationEmail({
                email, 
                name: user.name, 
                redirect_url: `${ENVIRONMENT.URL_API}/api/users/verify?verify_token=${verification_token}`
            })

            //If everything goes well responds with a success message
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
                response.status(500).send({message: 'Internal sever error', ok: false})
            }
        }
    }

}

const userController = new UserController()

export default userController