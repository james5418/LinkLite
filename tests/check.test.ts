import request from 'supertest';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import app from "../src/app";
import UrlSchema from '../src/models/Url';
import { client as redisClient } from '../src/databases/redis';
import { newExpiredDate } from '../src/utils/dateHandler';


const urlId: string = nanoid(5);

beforeAll(async () => {
    const validUrl = new UrlSchema({
        longUrl: "https://www.example.com",
        shortUrl: urlId,
        expireAt: newExpiredDate(),
    });
    await validUrl.save();
});

afterAll(async () => {
    await UrlSchema.deleteOne({ shortUrl : urlId });
    await redisClient.sendCommand(["del", urlId]);

    await redisClient.quit();
    mongoose.connection.close();
});


describe("GET /api/check/:id", () => {
    test('check a valid short url', async () => {
        const response = await request(app).get(`/api/check/${urlId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('longUrl');
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expireAt');
        expect(Object.keys(response.body).length).toBe(3);
    });
});
