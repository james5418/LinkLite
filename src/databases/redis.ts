import { createClient } from 'redis';
import { config } from '../config';

export const client = createClient({
    url: config.REDIS_URL
});

(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Connected to Redis'));
    await client.connect();
})();