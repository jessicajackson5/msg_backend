import express from "express";
import userController from "../controllers/user.controller.js";

const usersRouter = express.Router()

// application.user('/api/users', userRouter) // old way

// /api/users + '/'
usersRouter.get('/', userController.getAll)
usersRouter.post('/register', userController.register)
usersRouter.post('/login', userController.login)
usersRouter.get('/verify', userController.verify)
usersRouter.get('/resend-verification-mail', userController.resendVerificationEmail)
usersRouter.post('/manual-verify', userController.manualVerify) // For testing purposes

export default usersRouter