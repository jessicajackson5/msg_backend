import express from 'express'
import workspaceMiddleware from '../middleware/workspace.middleware.js'
import channelMiddleware from '../middleware/channel.middleware.js'
import messages_controller from '../controllers/messages.controller.js'
import authorizationMiddleware from '../middleware/auth.middleware.js'

const messageRouter = express.Router()

// Pass through workspce middleware to ensure it's a valid member 
// (channels to do not have members so workspace middleware takes care of that check)
// In the channel middleware we should verify that:
// 1. channel exists
// 2. channel belongs to the workspace
// Necesito saber que sea un cliente
messageRouter.use(authorizationMiddleware)


messageRouter.post(
    '/:workspace_id/:channel_id', 
    workspaceMiddleware,
    channelMiddleware,
    messages_controller.create
)

messageRouter.get(
    '/:workspace_id/:channel_id', 
    workspaceMiddleware,
    channelMiddleware,
    messages_controller.getAllByChannel
)

export default messageRouter