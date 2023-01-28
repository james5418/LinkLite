import request from 'supertest';
import mongoose from 'mongoose';
import app from "../src/app";
import UrlSchema from '../src/models/Url';
import { client as redisClient } from '../src/databases/redis';


let shortId: string = "";
let expireAt: number = new Date().getTime();

afterAll(async () => {
    await UrlSchema.deleteOne({ shortUrl : shortId });

    await redisClient.quit();
    mongoose.connection.close();
});

describe("POST /api/shorten", () => {

    test('given a valid url', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'});

        shortId = response.body.shortUrl.slice(-5);
        expireAt = Date.parse(response.body.expireAt);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expireAt');
        expect(Object.keys(response.body).length).toBe(2);
    });

    test('given a duplicate url', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expireAt');
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body.shortUrl.slice(-5)).toBe(shortId);
        expect(Date.parse(response.body.expireAt)).toBeGreaterThan(expireAt);
    });

    test('given an invalid url', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ url: 'htt://www.youtube.com/watch?v=dQw4w9WgXcQ'});

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid URL!');
    });

    test('given a wrong variable name (req.body.url undefined)', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ URL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'});

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid URL!');
    });
});
