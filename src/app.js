import {ENVIRONMENT} from "./environment.js";
import {connectDB} from './config/db.config.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'

// Connect to database
connectDB()

import express from 'express'
import usersRouter from "./routes/users.router.js";
import workspace_router from "./routes/workspace.router.js";
import workspaceMembersRouter from "./routes/workspaceMembers.router.js";
import channelRouter from "./routes/channel.router.js";
import messageRouter from "./routes/messages.router.js";

const app = express() //Create an express appliation 

// Production optimizations
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/', (request, response) => {
    response.send(`<h1>Server is running</h1>`)
})

app.get('/ping', (request, response) => {
    response.send('<h1>Server is running</h1>')
})

// API routes
app.use('/api/users', usersRouter)
app.use('/api/workspace', workspace_router)
app.use('/api/members', workspaceMembersRouter)
app.use('/api/channels', channelRouter)
app.use('/api/messages', messageRouter)

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error)
    res.status(500).json({ message: 'Internal server error', ok: false })
})

const PORT = ENVIRONMENT.PORT || 3000

app.listen(PORT, ()=> {
    /*Cuando el servidor se escucha en el puerto 3000 de mi pc se ejecutara esta funcion */
    console.log(`La applicacion se esta escuchando en http://localhost:${PORT}`)
})

