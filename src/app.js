
import {ENVIRONMENT} from "./environment.js";
import {connectDB} from './config/db.config.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'

connectDB()

import express from 'express'
import usersRouter from "./routes/users.router.js";
import workspace_router from "./routes/workspace.router.js";
import workspaceMembersRouter from "./routes/workspaceMembers.router.js";
import channelRouter from "./routes/channel.router.js";
import messageRouter from "./routes/messages.router.js";

const app = express() //Create an express appliation 
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send(`<h1>Server is running</h1>`)
})
app.get('/ping', (request, response) => {
    response.send('<h1>Server is running</h1>')
})


app.use('/api/users', usersRouter)
app.use('/api/workspace', workspace_router)
app.use('/api/members', workspaceMembersRouter)
app.use('/api/channels', channelRouter)
app.use('/api/messages', messageRouter)

app.listen(ENVIRONMENT.PORT, ()=> {
    /*Cuando el servidor se escucha en el puerto 3000 de mi pc se ejecutara esta funcion */
    console.log(`La applicacion se esta escuchando en http://localhost:${ENVIRONMENT.PORT}`)
})

