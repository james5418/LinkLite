import { Router, Request, Response } from 'express';


export const redirect_router = Router();

redirect_router.get('/:id', async(req: Request, res: Response): Promise<void> => {

    res.send(`redirect_route: ${req.params.id}`);
});