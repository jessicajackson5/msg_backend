import ChannelMessage from "../models/ChannelMessages.model.js"

class ChannelMessagesRepository {
    async create({user_id, channel_id, content}){
        const channel_message = new ChannelMessage({user_id, channel_id, content})
        await channel_message.save()
        return channel_message
    }
    async getAllByChannelId (channel_id) {
        const channel_messages = await ChannelMessage.find({channel_id: channel_id})
        .populate('user_id', 'name')

        const channel_messages_formatted = channel_messages.map((channel_message) => {
            return {
                _id: channel_message._id,
                user: channel_message.user_id,
                content: channel_message.content,
                created_at: channel_message.created_at
            }
        })
        return channel_messages_formatted
    }

    
}

const channel_messages_repository = new ChannelMessagesRepository()
export default channel_messages_repository