import mongoose from "mongoose";

/* El esquema define las validaciones que deben hacerse al crear un documento o actualizar */
const userSchema = new mongoose.Schema(
    /* objeto de configuracion/definicion del esquema */
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
const User = mongoose.model('users', userSchema)
export default User