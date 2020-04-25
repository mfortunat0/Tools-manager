# API Tools

## Links

[Swagger](https://app.swaggerhub.com/apis/xmaz10/Rest-api/1.0.0)
[Heroku](https://rest-api-tools.herokuapp.com/tools)

## Gettin started

#### Install dependencies project

```
npm install
```

#### Environment file

```
create a .env file and add arguments like:

JWT_KEY=d41d8cd98f00b204e9800998ecf8427e
MONGO_URL=mongodb://database/tools
```

#### Running docker compose

```
sudo docker-compose up -d
```

#### Running test

```
sudo docker-compos exec api npm test
```
