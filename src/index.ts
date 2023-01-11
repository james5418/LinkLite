import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from "morgan";

import { shorten_router } from './routes/shorten';
import { redirect_router } from './routes/redirect';
import { check_router } from './routes/check';

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.json());
app.use(cors());
app.use(helmet());

if(process.env.NODE_ENV !== 'test'){
    app.use(morgan('common')); 
}

app.use("/api/v1/shorten", shorten_router);
app.use("/", redirect_router);
app.use("/check", check_router);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});

export default app;
