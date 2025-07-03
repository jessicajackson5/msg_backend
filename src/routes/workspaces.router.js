import express from 'express'
import authorizationMiddleware from '../middleware/auth.middleware.js'
import workspaces_controller from '../controllers/workspaces.controller.js'


const workspaces_router = express.Router()

workspaces_router.post(
    '/',
    authorizationMiddleware,
    workspaces_controller.create
)

workspaces_router.get(
    '/',
    authorizationMiddleware,
    workspaces_controller.getAllByMember
)

workspaces_router.delete(
    '/:workspace_id',
    authorizationMiddleware,
    workspaces_controller.delete
)

export default workspaces_router
