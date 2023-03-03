import dotenv from 'dotenv';

dotenv.config();

export const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
};