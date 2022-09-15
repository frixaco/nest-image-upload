## Simple HTTP service to upload images to AWS S3 using NestJS

### Setup

1. Run `npm install`
2. Populate `.env` (use [`.env.example`](.env.example) as example)
3. Run `npm run start:dev` to launch server in watch mode

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
