declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_ACCESS_KEY_ID: string;
      AWS_S3_BUCKET: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      MAX_IMAGE_SIZE: string;
    }
  }
}
export {};
