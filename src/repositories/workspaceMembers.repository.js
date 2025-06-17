import WorkspaceMembers from "../models/WorkspaceMembers.model.js"
import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js";

const elevatedRoles = [
    AVAILABLE_ROLES_WORKSPACE_MEMBERS.ADMIN,
    AVAILABLE_ROLES_WORKSPACE_MEMBERS.CO_ADMIN
]
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

    async getAllByUserId (user_id){
        const workspaces_list = await WorkspaceMember
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
/*
    async findByWorkspaceId({workspace_id}) {
        return await WorkspaceMembers.find({ workspace_id }).populate('user_id')
    }
    async addMember({ workspace_id, user_id, role }){
        return await WorkspaceMembers.create({ workspace_id, user_id, role })
    }
    async removeMember({ workspace_id, user_id }){
        return await WorkspaceMembers.deleteOne({ workspace_id, user_id })
    }
    async getUserWorkspaces({ user_id }) {
        return await WorkspaceMembers.find({ user_id }).populate('workspace_id')
    }
    async getUserRole({ workspace_id, user_id }){
        return await WorkspaceMembers.findOne({ workspace_id, user_id })
    }
    // Checks if the member is either an admin or co_admin
    async isAdmin({ workspace_id, user_id }){
        const member = await WorkspaceMembers.findOne({ workspace_id, user_id })
        return elevatedRoles.includes(member?.role)
    }
    async updateUserRole({ workspace_id, user_id, role }){
        return await WorkspaceMembers.findOneAndUpdate(
            { workspace_id, user_id },
            { $set: { role } },
            { new: true, runValidators: true } 
    );
    // new returns object (by default false). runValidators checks role against scheme/enum
    }
}
*/
}
const workspaceMembersRepository = new WorkspaceMembersRepository()
export default workspaceMembersRepository