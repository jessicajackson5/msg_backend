import WorkspaceMembers from "../models/WorkspaceMembers.model.js"
import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js";

const elevatedRoles = [
    AVAILABLE_ROLES_WORKSPACE_MEMBERS.ADMIN,
    AVAILABLE_ROLES_WORKSPACE_MEMBERS.CO_ADMIN
]
class WorkspaceMembersRepository {
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

const workspaceMembersRepository = new WorkspaceMembersRepository()
export default workspaceMembersRepository