## Simple HTTP service to upload images to AWS S3 using NestJS

### Setup

1. Run `npm install`
2. Populate `.env` (use [`.env.example`](.env.example) as example)
3. Run `npm run start:dev` to launch server in watch mode

### Memory usage

Running `npm run start:dev` (with `NODE_OPTIONS=--max-old-space-size=256`) and running `npm run start:prod` (with NODE_OPTIONS=--max-old-space-size=64) keeps RAM usage under 200MB and 70MB, respectively, regardless of image size. Tested on 252MB, 192MB, 18MB, 10MB, 11KB images on Macbook Air M1 with 8GB RAM.

### Usage

- Request method should be `POST`
- Route should be the filename: `localhost:3000/image123.png`
- Request should have `size` header set and must be one of these values: `large`, `medium` or `thumb`
- Request should have `Content-Type` header set with valid `image/...` value

  **cURL**

  ```bash
  curl --location --request POST 'http://localhost:3000/thumb_image_1.jpg' \
       --header 'Content-Type: image/jpeg' \
       --header 'size: large' \
       --data-binary '@/Users/frixaco/Downloads/Clocktower_Panorama_20080622_20mb.jpg'
  ```
