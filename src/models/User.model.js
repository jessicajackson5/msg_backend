import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        email: {
            type: String, 
            required: true, 
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        created_at: {
            type: Date,
            default: new Date()
        }
    }
)
//Defino que la coleccion de users estara atada a esta validacion
const User = mongoose.model('Users', userSchema)
export default User