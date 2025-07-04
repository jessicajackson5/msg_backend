import User from "../models/User.model.js";

class UserRepository {
    async create({name, password, email}){
        try {
            const user = new User({name, password, email})
            console.log('[UserRepository] Creating user:', user)
            const savedUser = await user.save()
            console.log('[UserRepository] User saved successfully:', savedUser)
            return savedUser
        } catch (error) {
            console.error('[UserRepository] Error saving user:', error)
            throw error
        }
    }
    async getAll(){
        const users = await User.find()
        return users
    }

    async findByEmail({email}){
        return await User.findOne({email: email})
    }
    
    async verifyUserEmail ({email}){
        //.find es un filter de js
        //.findOne es un find de js
        const userFound = await this.findByEmail({email}) //filtramos a todos los usuarios que cumplan esta condicion
        
        if(userFound.verified){
            //throw lo uso para lanzar mi propio error
            throw { status:400, message:"User already verified" }
            
        }
        else{
            const result = await User.findByIdAndUpdate(
                userFound._id,
                {
                    $set: {
                        verified: true
                    }
                },
                {
                    runValidators: true,
                    new: true // When the update is executed, update the return value.
                }
            )
            
        }
    }
    
}

const userRepository = new UserRepository()

export default userRepository