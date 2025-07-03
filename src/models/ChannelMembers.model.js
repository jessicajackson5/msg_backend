import mongoose from "mongoose";

// Collection: channes_members, Atributos: member_id, channel_id, created_at

const channelMembersSchema = new mongoose.Schema(
    /* objeto de configuracion/definicion del esquema */
    {
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
            },
        channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
            },
        created_at: {
            type: Date,
            default: new Date()
        },
    }
)

const ChannelMembers = mongoose.model('Channel_members', channelMembersSchema)
export default ChannelMembers