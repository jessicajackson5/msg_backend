import express from 'express'
import authorizationMiddleware from '../middleware/auth.middleware.js'
import workspace_members_controller from '../controllers/workspaceMembers.controller.js'

const workspaceMembersRouter = express.Router()

workspaceMembersRouter.post(
    '/:workspace_id', 
    authorizationMiddleware, 
    workspace_members_controller.add
)    

export default workspaceMembersRouter