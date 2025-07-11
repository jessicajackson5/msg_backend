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

const Workspaces = mongoose.model('Workspaces', workspaceSchema, 'Workspaces')
export default Workspaces