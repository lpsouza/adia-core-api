# A.D.I.A Core API

This is the core API of the A.D.I.A. (Automated Digital Intelligence Assistant).

## A.D.I.A. Architecture

Understand the architecture of the A.D.I.A. [here](https://gist.github.com/lpsouza/a78eee78f2aaac99549a3f10846b7666).

## A.D.I.A. Core API funcionalities

- Manage users and their authentication
- Manage apps and their authentication

## Environment Variables

- `CONNECTION_STRING`: The connection string to MongoDB database.
- `CRYPTO_KEY`: The key used to encrypt and decrypt data.
- `TOKEN_KEY`: The key used to encrypt and decrypt tokens.
- `ACCESS_TOKEN_LIFE_TIME`: The life time of access tokens.
- `REFRESH_TOKEN_LIFE_TIME`: The life time of refresh tokens.

## Running the API with Docker

Start the API and configure the environment variables.

```bash
docker run -p 3000:3000 -e CONNECTION_STRING=mongodb://localhost:27017/adia -e CRYPTO_KEY=secret -e TOKEN_KEY=secret -e ACCESS_TOKEN_LIFE_TIME=3600 -e REFRESH_TOKEN_LIFE_TIME=86400 --name adia-core-api -d lpsouza/adia-core-api
```

If you need run the API without connecting to the database, this API will instance a MongoDB database in memory. Use this method to tests or demonstrations.

```bash
docker run -p 3000:3000 -e CRYPTO_KEY=secret -e TOKEN_KEY=secret -e ACCESS_TOKEN_LIFE_TIME=3600 -e REFRESH_TOKEN_LIFE_TIME=86400 --name adia-core-api -d lpsouza/adia-core-api
```
