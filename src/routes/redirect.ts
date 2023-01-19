import { Router, Request, Response } from 'express';


export const redirectRouter = Router();

redirectRouter.get('/:id', async(req: Request, res: Response): Promise<void> => {

    res.send(`redirect_route: ${req.params.id}`);
});