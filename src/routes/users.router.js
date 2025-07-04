import express from "express";
import userController from "../controllers/users.controller.js";

const usersRouter = express.Router()

// /api/users + '/'
usersRouter.get('/', userController.getAll)
usersRouter.post('/register', userController.register)
usersRouter.post('/login', userController.login)
usersRouter.get('/verify', userController.verify)
usersRouter.get('/resend-verification-mail', userController.resendVerificationEmail)

export default usersRouter