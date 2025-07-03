import channelRepository from "../repositories/channel.repository.js";
import workspaces_repository from "../repositories/workspaces.repository.js";
class ChannelService {
    async create(workspaceId, name) {
        try {
            if (typeof name !== 'string' || name.length >= 12) {
                throw { status: 400, message: 'The name of the channel should be a string with less than 12 characters' };
            }
            // Verify if the channel already exists
            const existingChannel = await channel_repository.findByName(name, workspaceId);
            if (existingChannel) {
                throw { status: 400, message: 'The name of the channel already exists' };
            }
            const workspace = await workspaces_repository.getById(workspaceId);
            if (!workspace) {
                throw { status: 404, message: 'Workspace not found' };
            }
            let default_is_private = false;
            await channel_repository.create(workspaceId, name, default_is_private);
            const channels = await channel_repository.getAllByWorkspaceId(workspaceId);
            return {
                channels
            };
        } catch (error) {
            throw error;
        }
    }
    async getAllByWorkspaceId(workspaceId){
        return await channel_repository.getAllByWorkspaceId(workspaceId)
    }
}
const channel_service = new ChannelService();
export default channel_service;

