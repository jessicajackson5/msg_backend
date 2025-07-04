import mongoose from 'mongoose';

// Colleccion: channel, Atributos: name, workspace_id, created_at, private
const channelSchema = new mongoose.Schema(
    /* objeto de configuracion/definicion del esquema */
    {
        name: {
            type: String,
            required: true
        },
        workspace_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspaces',
            required: true
            },
        created_at: {
            type: Date,
            default: new Date()
        },
        private: {
            type: Boolean,
            required: true,
            default: false
        }
    }
)
const Channel = mongoose.model('Channels', channelSchema, 'Channels')
export default Channel 