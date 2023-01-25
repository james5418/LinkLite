import { Router, Request, Response } from 'express';
import UrlSchema from '../models/Url';
import { client as redisClient } from '../databases/redis';
import { isExpired } from '../utils/dateHandler';


export const redirectRouter = Router();

redirectRouter.get('/:id', async(req: Request, res: Response): Promise<void> => {

    const urlId = req.params.id;

    const cacheData = await redisClient.hGetAll(urlId);

    if(Object.keys(cacheData).length !== 0){
        const expireAt = new Date(cacheData.expireAt);
        
        if(!isExpired(expireAt)){
            res.redirect(cacheData.longUrl);
        }
        else{
            await UrlSchema.deleteOne({ shortUrl : urlId });
            await redisClient.sendCommand(["del", urlId]);
            res.status(404).send(`This URL is expired.`);
        }
    }
    else{
        const urlRecord = await UrlSchema.findOne({ shortUrl : urlId });

        if(urlRecord && !isExpired(urlRecord.expireAt)){
            await redisClient.hSet(urlRecord.shortUrl, [
                'longUrl', urlRecord.longUrl,
                'expireAt', urlRecord.expireAt.toISOString(),
            ]);
            res.redirect(urlRecord.longUrl);
        }
        else if(urlRecord && isExpired(urlRecord.expireAt)){
            await UrlSchema.deleteOne({ shortUrl : urlId });
            res.status(404).send(`This URL is expired.`);
        }
        else{
            res.status(404).send(`${urlId} not found`);
        }
    }
    
});