# LinkLite

![Test](https://github.com/james5418/LinkLite/actions/workflows/main.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18.12.0-6DA55F)

🔗 https://linklite.onrender.com

LinkLite is a URL shortener that allows you to easily create short links to share with others.

It provides a RESTful API that supports the following HTTP methods:

| HTTP Type | API Endpoint              | Description                                         |
|:---------:| ------------------------- | --------------------------------------------------- |
|   POST    | /api/shorten              | Generate a short URL for a long URL                 |
|    GET    | /api/check/<short_url_id> | Retrieve information about a short URL              |
|    GET    | /<short_url_id>           | Redirect to the long URL for a given <short_url_id> |


## Usage

### Generate a short URL
The response will include the short URL and the expiration date in ISO format(UTC +0).<br>
The expiration date is set to **180** days from the time the short URL is generated.
```shell
curl -X POST -H "Content-Type:application/json" https://linklite.onrender.com/api/shorten -d '{
    "url": "<long_url>"
}'

# response
{
    "shortUrl": "https://linklite.onrender.com/<short_url_id>",
    "expireAt": "YYYY-MM-DDTHH:mm:ssZ"
}

```

### Retrieve information about the short URL
The response will include the long URL, the short URL, and the expiration date.
```shell
curl -L -X GET https://linklite.onrender.com/api/check/<short_url_id>

# response
{
    "longUrl": "<long_url>",
    "shortUrl": "https://linklite.onrender.com/<short_url_id>",
    "expireAt": "YYYY-MM-DDTHH:mm:ssZ"
}
```

### Redirect to the long URL
Simply enter the shout URL in the web browser or send a GET request using `curl`.
```shell
curl -L -X GET https://linklite.onrender.com/<short_url_id>
```


## Installation and Setup
To run this application, you can follow the steps below:

```
git clone git@github.com:james5418/LinkLite.git
```
```
cd LinkLite
```
Create a `.env` file in the root of the project and set the environment variables. Here's an example:

> PORT=8000<br>
> HOST=http\://localhost<br>
> MONGODB_URI=mongodb://localhost:27017<br>
> REDIS_URL=redis://localhost:6379<br>

```
npm install
```
```
npm run build
```
```
npm start
```


#### You can also utilize docker-compose to build and start the services.
```
docker-compose up -d --build
```
The API will be available at `http://localhost` (port 80).

