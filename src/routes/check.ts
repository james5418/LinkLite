import { Router, Request, Response } from 'express';
import UrlSchema, { IUrl } from '../models/Url';


export const checkRouter = Router();

checkRouter.get('/:id', async(req: Request, res: Response): Promise<void> => {

    const urlId = req.params.id;
    const urlRecord = await UrlSchema.findOne({ shortUrl : urlId });

    if(urlRecord){
        const result: IUrl = {
            longUrl: urlRecord.longUrl,
            shortUrl: `${process.env.HOST}/${urlRecord.shortUrl}`,
            expireAt: urlRecord.expireAt,
        } 
        res.status(200).json(result);
    }
    else{
        res.status(404).send(`${urlId} not found`);
    }

});