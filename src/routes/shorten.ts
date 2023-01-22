import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import UrlSchema, { IUrl } from '../models/Url';
import { client as redisClient } from '../databases/redis';
import isValidUrl from '../utils/validUrl';
import { isExpired, newExpiredDate} from '../utils/dateHandler';


export const shortenRouter = Router();

shortenRouter.post('/', async(req: Request, res: Response): Promise<void> => {

    const { url } = req.body;

    if(!isValidUrl(url)){
        res.status(400).send("Invalid URL!");
    }

    const urlRecord = await UrlSchema.findOne({ longUrl : url });

    if(urlRecord){
        urlRecord.expiredAt = newExpiredDate();
        const saveUrl = await urlRecord.save();
        res.status(200).json(saveUrl)
    }
    else{
        const newUrl = new UrlSchema({
            longUrl: url,
            shortUrl: nanoid(10),
            expiredAt: newExpiredDate(),
        });
        const saveUrl = await newUrl.save();

        res.status(200).json(saveUrl);
    }

});