import express from 'express';
import channel_controller from '../controllers/channel.controller.js'
import authorizationMiddleware from '../middleware/auth.middleware.js' 
import workspaceMiddleware from '../middleware/workspace.middleware.js'

const channelRouter = express.Router()

channelRouter.post('/:workspace_id', authorizationMiddleware, workspaceMiddleware, channel_controller.create)
channelRouter.get('/:workspace_id', authorizationMiddleware, workspaceMiddleware, channel_controller.getAllByWorkspaceId)

export default channelRouter