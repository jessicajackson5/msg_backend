import mongoose from "mongoose";

// Colleccion: channel_messages, Atributos: member_channel_id, chanel_id, contenido, created_at

const channelMessagesSchema = new mongoose.Schema(
    /* objeto de configuracion/definicion del esquema */
    {
        member_channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChannelMembers',
            required: true
            },
        channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
            },
        contenido: {
            type: String,
            default: ''
            },
        created_at: {
            type: Date,
            default: new Date()
        },
    }
)

const ChannelMessages = mongoose.model('channel_messages', channelMessagesSchema)
export default ChannelMessages