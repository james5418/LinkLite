import { Router, Request, Response } from 'express';


export const checkRouter = Router();

checkRouter.get('/:short_url', async(req: Request, res: Response): Promise<void> => {

    res.send(`check_router: ${req.params.short_url}`);
});