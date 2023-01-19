import { Router, Request, Response } from 'express';
import UrlSchema from '../models/url';
import { client as redisClient } from '../databases/redis';


export const shortenRouter = Router();

shortenRouter.post('/', async(req: Request, res: Response): Promise<void> => {

    const now = new Date();

    const newUrl = new UrlSchema({
        longUrl: "https://example.com",
        shortUrl: "xyz",
        expiredAt: now,
    });

    const saveUrl = await newUrl.save();
    res.status(200).json(saveUrl);

});