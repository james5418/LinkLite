import mongoose from 'mongoose';

export default () => {
    mongoose.set('strictQuery', false);

    mongoose.connect(`${process.env.MONGODB_URI}`).then(() => { 
        console.log('Connected to MongoDB'); 
    }).catch(err => {
        console.log(`MongoDB connection error. ${err}`);
    });
}