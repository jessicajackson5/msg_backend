import express from 'express'
import authorizationMiddleware from '../middleware/auth.middleware.js'
import workspace_controller from '../controllers/workspace.controller.js'


const workspaces_router = express.Router()

workspaces_router.post(
    '/',
    authorizationMiddleware,
    workspace_controller.create
)

workspaces_router.get(
    '/',
    authorizationMiddleware,
    workspace_controller.getAllbyMember
)

workspaces_router.delete(
    '/:workspace_id',
    authorizationMiddleware,
    workspace_controller.delete
)

export default workspaces_router
