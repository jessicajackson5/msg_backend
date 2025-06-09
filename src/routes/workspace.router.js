import express from "express";
import authorizationMiddleware from "../middleware/auth.middleware.js";   
import workspace_controller from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router()

workspaceRouter.post(
    '/', 
    authorizationMiddleware,
    workspace_controller.create
)
export default workspaceRouter; 