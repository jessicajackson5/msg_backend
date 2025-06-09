import mongoose from 'mongoose';
import {ENVIRONMENT} from "../environment.js";

// Configure the connection with my DB in mongoDB
export const connectDB = async () => {
    try{
        await mongoose.connect(
            `${ENVIRONMENT.DB_URL}/${ENVIRONMENT.DB_NAME}`
        )
        console.log('Connection exitosa')
    }
    catch(error){
        console.log('Error connecting to DB', error)
    }
}