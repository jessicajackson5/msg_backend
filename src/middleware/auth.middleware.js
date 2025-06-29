import jwt from 'jsonwebtoken'
import { ENVIRONMENT } from '../environment.js'

const authorizationMiddleware = (request, response, next) => {
    try {
        const authorization_header = request.headers['authorization']
        const authorization_type = authorization_header.split(' ')[0]
        const authorization_token = authorization_header.split(' ')[1]
        const authorization_token_payload = jwt.verify(authorization_token, ENVIRONMENT.JWT_SECRET_KEY)
        request.user = authorization_token_payload
        next()
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            response.status(401).send({
                ok: false,
                message: 'Token invalid',
                status: 401
            })
        }
        else {
            response.status(500).send(
                {
                    ok: false,
                    message: 'Internal server error',
                    status: 500
                }
            )
        }
    }
}
export default authorizationMiddleware