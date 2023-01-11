import { Router, Request, Response } from 'express';


export const shorten_router = Router();

shorten_router.post('/', async(req: Request, res: Response): Promise<void> => {

    res.send('shorten_route');
});