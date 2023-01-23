import mongoose from 'mongoose';

export interface IUrl {
    longUrl: string;
    shortUrl: string;
    expireAt: Date;
}

const UrlSchema = new mongoose.Schema<IUrl>({
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model <IUrl> ("Url", UrlSchema);