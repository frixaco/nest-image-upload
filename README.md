## Simple HTTP service to upload images to AWS S3 using NestJS

### Setup

1. Run `npm install`
2. Populate `.env` (use [`.env.example`](.env.example) as example)
3. Run `npm run start:dev` to launch server in watch mode

### Memory usage

Running `npm run start:dev` (with `NODE_OPTIONS=--max-old-space-size=256`) and running `NODE_OPTIONS=--max-old-space-size=64 node dist/main` keeps RAM usage under 200MB and 70MB, respectively, regardless of image size (tested with 252MB, 192MB, 11KB images)

### Usage

- Request should be `POST` request
- Route should contain the filename: `localhost:3000/image123.png`
- Request should have `size` header set and must be one of these values: `large`, `medium` or `thumb`

  **cURL**

  ```bash
  curl --location --request POST 'http://localhost:3000/image12345.png' \
      --header 'Content-Type: image/png' \
      --header 'size: large' \
      --data-binary '@/Users/frixaco/Downloads/image.png'
  ```
