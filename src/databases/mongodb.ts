import mongoose from 'mongoose';

export default async () => {
    mongoose.set('strictQuery', false);

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('Connected to MongoDB');
    }catch(err){
        console.log(`MongoDB connection error. ${err}`);
    }
}