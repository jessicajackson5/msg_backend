import WorkspaceMembers from "../models/WorkspaceMembers.model.js"

class WorkspaceMembersRepository {
    async create({workspace_id, user_id, role}){
        const workspace_member = new WorkspaceMembers({
            workspace_id,
            user_id,
            role
        })
        await workspace_member.save()
    }
    async getAllbyWorkspaceID(workspace_id){
        return await WorkspaceMembers.find({workspace_id:workspace_id})
    }

    async getAllbyUserID (user_id){
        const workspaces_list = await WorkspaceMembers
        .find({user_id: user_id})
        .populate('workspace_id', 'name') //Expandirme los datos referenciados de la propiedad workspace_id
        //Populate solo sirve si la propiedad que intentamos expandir tiene una referencia a otra coleccion existente
        
        const workspaces_list_formatted = workspaces_list.map((workspace_member) => {
            return {
                _id: workspace_member._id,
                user: workspace_member.user_id,
                workspace: workspace_member.workspace_id,
                role: workspace_member.role
            }
        })
        return workspaces_list_formatted
    }
    async getMemberByWorkspaceIdAndUserId (workspace_id, user_id) {
        return await WorkspaceMembers.findOne({workspace_id: workspace_id, user_id: user_id})
    }

}
const workspace_members_repository = new WorkspaceMembersRepository()
export default workspace_members_repository