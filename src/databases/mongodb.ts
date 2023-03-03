import mongoose from 'mongoose';
import { config } from '../config';

export default async () => {
    mongoose.set('strictQuery', false);

    try{
        await mongoose.connect(`${config.MONGODB_URI}`);
        console.log('Connected to MongoDB');
    }catch(err){
        console.log(`MongoDB connection error. ${err}`);
    }
}