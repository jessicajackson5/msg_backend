import User from "../models/User.model.js";

class UserRepository {
    async create({name, password, email}){
            const user = new User({name, password, email})
            await user.save()
    }
    async getAll(){
        const users = await User.find()
        return users
    }

    async findByEmail({email}){
        return await User.findOne({email: email})
    }
    
    async verifyUserEmail ({email}){
        //.findOne us find from js
        const userFound = await this.findByEmail({email}) //filtramos a todos los usuarios que cumplan esta condicion
        
        if(userFound.verified){
            //throw is used for my own
            throw { status:400, message:"Usar already validated" }
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
                    new: true //When this executes the return is updated
                }
            )
            
        }
    }
    
}

const userRepository = new UserRepository()

export default userRepository