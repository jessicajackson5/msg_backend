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
import errorMiddleware from "./middleware/error.middleware.js";

const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://msg-frontend-tawny.vercel.app', // my deployed frontend
];

const app = express()
// app.use(cors())
app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Server is running</h1>')
})

app.get('/ping', (request, response) => {
    response.send('<h1>Server is running</h1>')
})

app.use('/api/users', usersRouter)
app.use('/api/workspaces', workspace_router)
app.use('/api/members', workspaceMembersRouter)
app.use('/api/channels', channelRouter)
app.use('/api/messages', messageRouter)

app.use(errorMiddleware)

app.listen(ENVIRONMENT.PORT, () => {
    console.log(`The application is listening on http://localhost:${ENVIRONMENT.PORT}`)
})