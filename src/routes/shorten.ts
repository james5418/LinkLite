import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import UrlSchema from '../models/Url';
import { IShortenResult } from '../models/ShortenResult';
import { client as redisClient } from '../databases/redis';
import isValidUrl from '../utils/validUrl';
import { newExpiredDate } from '../utils/dateHandler';


export const shortenRouter = Router();

shortenRouter.post('/', async(req: Request, res: Response): Promise<void> => {

    const url: string  = req.body.url;

    if(!isValidUrl(url)){
        res.status(400).send("Invalid URL!");
    }

    const urlRecord = await UrlSchema.findOne({ longUrl : url });

    if(urlRecord){
        urlRecord.expireAt = newExpiredDate();
        const saveUrl = await urlRecord.save();

        // cache

        const output: IShortenResult = {
            shortUrl: `${process.env.HOST}/${saveUrl.shortUrl}`,
            expireAt: saveUrl.expireAt,
        }
        res.status(200).json(output);
    }
    else{
        const newUrl = new UrlSchema({
            longUrl: url,
            shortUrl: nanoid(10),
            expireAt: newExpiredDate(),
        });
        const saveUrl = await newUrl.save();

        // cache

        const output: IShortenResult = {
            shortUrl: `${process.env.HOST}/${saveUrl.shortUrl}`,
            expireAt: saveUrl.expireAt,
        }
        res.status(200).json(output);
    }

});