
import channel_messages_repository from "../repositories/channelMessages.repository.js";

class ChannelMessagesService {
    async create({user_id, channel_id, content}){    
        if(!content){
            throw { status: 400, message: 'Content is required' };
        }
        await channel_messages_repository.create({user_id, channel_id, content})
        const messages_list = await channel_messages_repository.getAllByChannelId(channel_id) 
        return messages_list
    }   

    async getAllByChannelId( {channel_id} ){
        const messages_list = await channel_messages_repository.getAllByChannelId( channel_id )
        return messages_list
    }
}

const channel_messages_service = new ChannelMessagesService()

export default channel_messages_service
