import { createClient } from 'redis';

export const client = createClient({
    url: process.env.REDIS_URL
});

(async() => {
    client.on('connect', () => console.log('Connected to Redis'));
    await client.connect();
})();