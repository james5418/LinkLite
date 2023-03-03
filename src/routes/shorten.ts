import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { config } from '../config';
import UrlSchema from '../models/Url';
import { IShortenResult } from '../models/ShortenResult';
import { newExpiredDate } from '../utils/dateHandler';
import { isValidUrl, removeTrailingSlash } from '../utils/urlHandler';

export const shortenRouter = Router();

shortenRouter.post('/', async(req: Request, res: Response): Promise<void> => {

    if(!isValidUrl(req.body.url)){
        res.status(400).send("Invalid URL!");
        return;
    }

    const url: string  = removeTrailingSlash(req.body.url);

    const urlRecord = await UrlSchema.findOne({ longUrl : url });

    if(urlRecord){
        urlRecord.expireAt = newExpiredDate();
        const saveUrl = await urlRecord.save();

        const result: IShortenResult = {
            shortUrl: `${config.HOST}/${saveUrl.shortUrl}`,
            expireAt: saveUrl.expireAt,
        }
        res.status(200).json(result);
    }
    else{
        const newUrl = new UrlSchema({
            longUrl: url,
            shortUrl: nanoid(5),
            expireAt: newExpiredDate(),
        });
        const saveUrl = await newUrl.save();

        const result: IShortenResult = {
            shortUrl: `${config.HOST}/${saveUrl.shortUrl}`,
            expireAt: saveUrl.expireAt,
        }
        res.status(200).json(result);
    }

});