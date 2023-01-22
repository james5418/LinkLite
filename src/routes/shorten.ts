import { Router, Request, Response } from 'express';
import UrlSchema from '../models/Url';
import { client as redisClient } from '../databases/redis';
import isValidUrl from '../utils/validUrl';
import { isExpired, newExpiredDate} from '../utils/dateHandler';


export const shortenRouter = Router();

shortenRouter.post('/', async(req: Request, res: Response): Promise<void> => {

    const date = new Date("2023-01-10T12:54:30.781+00:00");
    const now = new Date();

    const newUrl = new UrlSchema({
        longUrl: "https://example.com",
        shortUrl: "xyz",
        expiredAt: now,
    });

    const saveUrl = await newUrl.save();
    res.status(200).json(saveUrl);

});