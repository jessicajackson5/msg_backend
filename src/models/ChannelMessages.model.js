import mongoose from "mongoose";

// Colleccion: channel_messages, Atributos: member_channel_id, chanel_id, contenido, created_at

const channelMessagesSchema = new mongoose.Schema(
    /* objeto de configuracion/definicion del esquema */
    {

        channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
            },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
            },
        content: {
            type: String,
            default: ''
            },
        created_at: {
            type: Date,
            default: new Date()
        },
    }
)

const ChannelMessages = mongoose.model('Channel_messages', channelMessagesSchema)
export default ChannelMessages