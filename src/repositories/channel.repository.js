import Channel from '../models/Channel.model.js';

class ChannelRepository {
    async create(workspaceId, name, isPrivate) {
        try {
            const channel = new Channel({
                name,
                workspace_id: workspaceId,
                private: isPrivate
            });
            await channel.save();
            return channel;
        } catch (error) {
            throw error;
        }
    }
    async findByName(name, workspaceId) {
        try {
            const channel = await Channel.findOne({ name, workspace_id: workspaceId });
            return channel;
        } catch (error) {
            throw error;
        }
    }
    
    async findById(id) {
        try {
            const channel = await Channel.findById(id);
            return channel;
        } catch (error) {
            throw error;
        }
    }

    async getAllbyWorkspace(workspaceId){
        try {
            const channels = await Channel.find({workspace_id: workspaceId});
            return channels;
        } catch (error) {
            throw error;
        }

    }
}

const channel_repository = new ChannelRepository();
export default channel_repository;
