import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: false
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Workspace = mongoose.model('workspaces', workspaceSchema)
export default Workspace