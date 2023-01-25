import { Router, Request, Response } from 'express';
import UrlSchema, { IUrl } from '../models/Url';
import { client as redisClient } from '../databases/redis';
import { isExpired } from '../utils/dateHandler';


export const checkRouter = Router();

checkRouter.get('/:id', async(req: Request, res: Response): Promise<void> => {

    const urlId = req.params.id;

    const cacheData = await redisClient.hGetAll(urlId);

    if(Object.keys(cacheData).length !== 0){
        const expireAt = new Date(cacheData.expireAt);

        if(!isExpired(expireAt)){
            const result: IUrl = {
                longUrl: cacheData.longUrl,
                shortUrl: `${process.env.HOST}/${urlId}`,
                expireAt: expireAt,
            } 
            res.status(200).json(result);
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

            const result: IUrl = {
                longUrl: urlRecord.longUrl,
                shortUrl: `${process.env.HOST}/${urlRecord.shortUrl}`,
                expireAt: urlRecord.expireAt,
            } 
            res.status(200).json(result);
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