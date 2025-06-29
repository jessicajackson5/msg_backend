
import express from 'express'
import authorizationMiddleware from '../middleware/auth.middleware.js'
import workspace_controller from '../controllers/workspace.controller.js'


const workspace_router = express.Router()

workspace_router.post(
    '/',
    authorizationMiddleware,
    workspace_controller.create
)

workspace_router.get(
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
