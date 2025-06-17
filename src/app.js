
import {ENVIRONMENT} from "./environment.js";
import {connectDB} from './config/db.config.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'

connectDB()

import express from 'express'
import authorizationMiddleware from "./middleware/auth.middleware.js";   
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import workspace_router from "./routes/workspace.router.js";
import workspaceMembersRouter from "./routes/workspaceMembers.router.js";

const app = express() //Crea una aplicacion de express
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send(`<h1>Server is running</h1>`)
})
app.get('/ping', (request, response) => {
    response.send('<h1>Server is running</h1>')
})


app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/workspace', workspace_router)
app.use('/api/members', workspaceMembersRouter)


app.listen(ENVIRONMENT.PORT, ()=> {
    /*Cuando el servidor se escucha en el puerto 3000 de mi pc se ejecutara esta funcion */
    console.log(`La applicacion se esta escuchando en http://localhost:${ENVIRONMENT.PORT}`)
})

