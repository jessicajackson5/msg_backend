import express from "express";
import authorizationMiddleware from "../middleware/auth.middleware.js";   
import workspace_controller from "../controllers/workspace.controller.js";

const workspace_router = express.Router()

workspace_router.post(
    '/', 
    authorizationMiddleware,
    workspace_controller.create
)
/*workspaceRouter.get(
    '/', 
    authorizationMiddleware,
    workspace_controller.getAll
)
// Placeholder -- I think I need a workspace ID for the below?
workspaceRouter.get(
    '/:workspace_id/get-workspace-members', 
    authorizationMiddleware,
    workspace_controller.getWorkspaceMembers
)*/
// Delete a workspace
workspace_router.delete(
    '/:workspace_id',
    authorizationMiddleware,
    workspace_controller.delete
)
export default workspace_router; 