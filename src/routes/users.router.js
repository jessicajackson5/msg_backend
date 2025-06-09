import express from "express";
import userController from "../controllers/user.controller.js";
// Esta ruta se encarag de manejar users
// Paso 1: Crear la ruta user Router
const usersRouter = express.Router()

//Paso 2: Mi aplicacion delega las consutlasa la direcion /api/users a el enroutador
// application.user('/api/users', userRouter) // old way

//PASO 3: Creo las consultas que va a tener mi enroutador
// /api/users + '/'
usersRouter.get('/', userController.getAll)
// /api/users + '/'
usersRouter.post('/register', userController.register)
usersRouter.post('/login', userController.login)

usersRouter.get('/verify', userController.verify)

usersRouter.get('/resend-verification-mail', userController.resendVerificationEmail)

// api/users/api/users/hola
usersRouter.put('/api/users/hola', (request, response) => {
    response.send("FUNCIONAAAA")
})

export default usersRouter