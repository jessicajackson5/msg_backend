import express from "express";
import authorizationMiddleware from "../middleware/auth.middleware.js";   
import workspace_controller from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router()

workspaceRouter.post(
    '/create', 
    authorizationMiddleware,
    workspace_controller.create
)
workspaceRouter.get(
    '/get-workspaces', 
    authorizationMiddleware,
    workspace_controller.getWorkspaces
)
// Placeholder -- I think I need a workspace ID for the below?
workspaceRouter.get(
    '/:workspace_id/get-workspace-members', 
    authorizationMiddleware,
    workspace_controller.getWorkspaceMembers
)
// Delete a workspace
workspaceRouter.delete(
    '/:workspace_id',
    authorizationMiddleware,
    workspace_controller.deleteWorkspace
)
export default workspaceRouter; 