import mongoose from 'mongoose';
import {ENVIRONMENT} from "../environment.js";

// Configure the connection with my DB in mongoDB
export const connectDB = async () => {
    try{
        const dbUrl = ENVIRONMENT.DB_URL || 'mongodb://localhost:27017';
        const dbName = ENVIRONMENT.DB_NAME || 'msg_app';
        
        // If it's a MongoDB Atlas URL (contains mongodb.net), use it as is
        if (dbUrl.includes('mongodb.net')) {
            await mongoose.connect(dbUrl, {
                retryWrites: true,
                w: 'majority'
            });
        } else {
            // Local MongoDB connection
            await mongoose.connect(`${dbUrl}/${dbName}`);
        }
        
        console.log('Connection exitosa')
    }
    catch(error){
        console.log('Error connecting to DB', error)
        console.log('DB URL being used:', ENVIRONMENT.DB_URL || 'mongodb://localhost:27017')
    }
}