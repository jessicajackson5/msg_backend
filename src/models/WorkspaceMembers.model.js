import mongoose from "mongoose";
import { AVAILABLE_ROLES_WORKSPACE_MEMBERS } from "../dictionaries/availableRoles.dictionary.js";

const workspaceMembersSchema = new mongoose.Schema(
    {
        workspace_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspaces',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: AVAILABLE_ROLES_WORKSPACE_MEMBERS.MEMBER,
            enum: Object.values(AVAILABLE_ROLES_WORKSPACE_MEMBERS)
        },
        created_at: {
            type: Date,
            default: new Date
        }
    }
)

const WorkspaceMembers = mongoose.model('Workspace_members', workspaceMembersSchema, 'Workspace_members')
export default WorkspaceMembers