import app from './app';
import { config } from './config';

const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

export default server;