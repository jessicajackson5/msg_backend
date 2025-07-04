import workspace_members_repository from "../repositories/workspaceMembers.repository.js";
import workspaces_repository from "../repositories/workspaces.repository.js";

const workspaceMiddleware = async (req, res, next) => {
  const workspaceId = req.params.workspace_id;
  const userId = req.user.id;

  try {
    const workspace = await workspaces_repository.getByID(workspaceId);
    if (!workspace) {
      throw { status: 404, message: "Workspace not found" };
    }

    const member =
      await workspace_members_repository.getMemberByWorkspaceIdAndUserId(
        workspaceId,
        userId
      );

    if (!member) {
      throw { status: 403, message: "You are not a member of this workspace" };
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    if (error.status) {
      res.status(error.status).send({
        message: error.message,
        ok: false,
      });
      return;
    } else {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error interno del servidor", ok: false });
    }
  }
};

export default workspaceMiddleware;