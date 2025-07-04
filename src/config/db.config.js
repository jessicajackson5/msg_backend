import mongoose from 'mongoose'
import { ENVIRONMENT } from '../environment.js'

//Configure the connection with my DB in mongoDB

export const connectDB = async () => {
    try{
        await mongoose.connect(
            `${ENVIRONMENT.DB_URL}/${ENVIRONMENT.DB_NAME}`
        )
        console.log('Connection successful')
    }
    catch(error){
        console.error('Connection error:', error)
    }
}