import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from "morgan";
import { config } from './config';
import { shortenRouter } from './routes/shorten';
import { redirectRouter } from './routes/redirect';
import { checkRouter } from './routes/check';
import connectDB from './databases/mongodb';


connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

if(config.NODE_ENV === 'dev'){
    app.use(morgan('dev')); 
}
else if(config.NODE_ENV === 'production'){
    app.use(morgan('common')); 
}

app.get('/health-check', (req: Request, res: Response) => {
    res.status(200).send('ok');
});

app.use("/api/shorten", shortenRouter);
app.use("/api/check", checkRouter);
app.use("/", redirectRouter);

export default app;