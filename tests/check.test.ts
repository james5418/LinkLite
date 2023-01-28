import request from 'supertest';
import mongoose from 'mongoose';
import app from "../src/app";
import UrlSchema from '../src/models/Url';
import { client as redisClient } from '../src/databases/redis';
import { newExpiredDate } from '../src/utils/dateHandler';


const validUrlId: string = "isValid";
const expiredUrlId: string = "isExpired";
const nonExistentUrlId: string = "nonExistent";


beforeAll(async () => {
    const validUrl = new UrlSchema({
        longUrl: "https://www.example.com",
        shortUrl: validUrlId,
        expireAt: newExpiredDate(),
    });
    await validUrl.save();

    const expiredUrl = new UrlSchema({
        longUrl: "https://www.example.com",
        shortUrl: expiredUrlId,
        expireAt: new Date("2022-03-30"),
    });
    await expiredUrl.save();
});


afterAll(async () => {
    await UrlSchema.deleteOne({ shortUrl : validUrlId });
    await redisClient.sendCommand(["del", validUrlId]);
    await redisClient.sendCommand(["del", nonExistentUrlId]);

    await redisClient.quit();
    mongoose.connection.close();
});


describe("GET /api/check/:id", () => {
    test('check a valid short url (using database)', async () => {
        const response = await request(app).get(`/api/check/${validUrlId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('longUrl');
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expireAt');
        expect(Object.keys(response.body).length).toBe(3);
    });

    test('check a expired valid short url (using database)', async () => {
        const response = await request(app).get(`/api/check/${expiredUrlId}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe('This URL is expired.');
    });

    test('check a non-existent short url (using database)', async () => {
        const response = await request(app).get(`/api/check/${nonExistentUrlId}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe(`${nonExistentUrlId} not found`);
    });

    test('check a valid short url (using cache)', async () => {
        const response = await request(app).get(`/api/check/${validUrlId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('longUrl');
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expireAt');
        expect(Object.keys(response.body).length).toBe(3);
    });

    test('check a expired valid short url (using cache)', async () => {
        await redisClient.hSet(expiredUrlId, [
            'longUrl', "https://www.example.com",
            'expireAt', new Date("2022-03-30").toISOString(),
        ]);

        const response = await request(app).get(`/api/check/${expiredUrlId}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe('This URL is expired.');
    });

    test('check a non-existent short url (using cache)', async () => {
        const response = await request(app).get(`/api/check/${nonExistentUrlId}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe(`${nonExistentUrlId} not found`);
    });
});
