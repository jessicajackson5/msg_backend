import express from 'express'
import authorizationMiddleware from '../middleware/auth.middleware.js'
import workspace_controller from '../controllers/workspaces.controller.js'


const workspaces_router = express.Router()

workspaces_router.post(
    '/',
    authorizationMiddleware,
    workspace_controller.create
)

workspaces_router.get(
    '/',
    authorizationMiddleware,
    workspace_controller.getAllByMember
)

workspace_router.delete(
    '/:workspace_id',
    authorizationMiddleware,
    workspace_controller.delete
)

export default workspace_router
