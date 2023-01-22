import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from "morgan";
import { shortenRouter } from './routes/shorten';
import { redirectRouter } from './routes/redirect';
import { checkRouter } from './routes/check';
import connectDB from './databases/mongodb';


dotenv.config();

connectDB();

const app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.json());
app.use(cors());
app.use(helmet());

if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev')); 
}
else if(process.env.NODE_ENV === 'production'){
    app.use(morgan('common')); 
}

app.use("/api/shorten", shortenRouter);
app.use("/api/check", checkRouter);
app.use("/", redirectRouter);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});

export default app;