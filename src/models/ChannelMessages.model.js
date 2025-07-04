import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema(
    {
        channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channels',
            required: true
            },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
            },
        content: {
            type: String,
            default: '',
            required: true,
            },
        created_at: {
            type: Date,
            default: new Date()
        },
    }
)

const ChannelMessages = mongoose.model('Channel_messages', channelMessagesSchema, 'Channel_messages')
export default ChannelMessages