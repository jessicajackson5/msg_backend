import mongoose from 'mongoose';
import {ENVIRONMENT} from "../environment.js";

// Configure the connection with my DB in mongoDB
export const connectDB = async () => {
    try{
        const dbUrl = ENVIRONMENT.DB_URL || 'mongodb://localhost:27017';
        const dbName = ENVIRONMENT.DB_NAME || 'msg_app';
        
        // Local MongoDB connection
        await mongoose.connect(`${dbUrl}/${dbName}`, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        
        console.log('Connection exitosa')
        console.log('DB URL being used:', ENVIRONMENT.DB_URL || 'mongodb://localhost:27017')
    }
    catch(error){
        console.log('Error connecting to DB', error)
        console.log('DB URL being used:', ENVIRONMENT.DB_URL || 'mongodb://localhost:27017')
    }
}