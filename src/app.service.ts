import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as stream from 'stream';
import { ImageSize, parseFilename } from './utils';

@Injectable()
export class AppService {
  client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  async uploadimage(
    request: Request,
    response: Response,
    image: string,
    size: ImageSize,
  ): Promise<{ filename: string; url: string }> {
    const [filename, extension] = parseFilename(image);

    const Key = filename + '_' + size + extension;
    const Bucket = process.env.AWS_S3_BUCKET;
    const passThroughStream = new stream.PassThrough();

    try {
      const parallelUploads3 = new Upload({
        client: this.client,
        params: {
          Bucket,
          Key,
          Body: passThroughStream,
          ACL: 'public-read',
        },
        queueSize: 1,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      let imageSize = 0;
      request.on('data', (chunk) => {
        imageSize += chunk.length;

        if (
          imageSize >
          Number(process.env.MAX_IMAGE_SIZE_IN_MB) * 1024 * 1024
        ) {
          response.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Too large image size',
          });
          request.destroy();
        }
      });
      request.pipe(passThroughStream);

      const result =
        (await parallelUploads3.done()) as CompleteMultipartUploadCommandOutput;

      return {
        filename: result.Key,
        url: result.Location,
      };
    } catch (e) {
      throw new HttpException(
        'Failed to upload image to AWS S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
