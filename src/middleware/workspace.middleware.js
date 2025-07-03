// workspace exists
// client belongs to the workspace

import members_workspace_repository from "../repositories/workspaceMembers.repository.js"
import workspaces_repository from "../repositories/workspaces.repository.js"

const workspaceMiddleware = async (req, res, next) => {
    const { workspaceId } = req.params;
    const { userId } = req.user.userId; // This is the id of the user that made the request from auth middleware

    try {
        const workspace = await workspaces_repository.getById(workspaceId);
        if(!workspace) {
            throw {
                status: 404,
                message: "Workspace not found"
            }
        }
        const member = await members_workspace_repository.getMemberByWorkspaceIDandUserID   (workspaceId, userId);
        if(!member) {
            throw {
                status: 403,
                message: "You are not a member of this workspace."
            }
        }
        req.workspace = workspace;
        next();
    } catch (error) {
        res.status(error.status).json(
            { 
                message: error.message,
                status: error.status,
                ok: false 
            }
        )
    }
}

export default workspaceMiddleware; 