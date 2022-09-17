import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as sharp from 'sharp';
import * as stream from 'stream';
import { ImageSize, imageSizeMapping, parseFilename } from './utils';

@Injectable()
export class AppService {
  client = new S3Client({
    apiVersion: 'v4',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  async uploadImage(
    request: Request,
    response: Response,
    filename: string,
    size: ImageSize,
  ): Promise<{ filename: string; url: string }> {
    const [name, ext] = parseFilename(filename);
    const Key = name + '_' + size + ext;
    const Bucket = process.env.AWS_S3_BUCKET;
    const uploadStream = new stream.PassThrough();

    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket,
          Key,
          Body: uploadStream,
          ACL: 'public-read',
        },
        queueSize: 1,
      });

      const checkSizeStream = sharp().metadata((err, m) => {
        if (
          m &&
          'size' in m &&
          m.size > Number(process.env.MAX_IMAGE_SIZE_IN_MB) * 1024 * 1024
        ) {
          response.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Too large image size',
          });
        }
      });
      const resizeStream = sharp().resize(imageSizeMapping[size]).jpeg();

      // Workaround for https://github.com/lovell/sharp/issues/3313
      uploadStream.on('close', async () => {
        const result =
          (await upload.done()) as CompleteMultipartUploadCommandOutput;
        response.send({
          filename: result.Key,
          url: result.Location,
        });
      });

      stream.pipeline(
        request,
        checkSizeStream,
        resizeStream,
        uploadStream,
        (err) => {
          if (err) {
            console.error('Pipeline failed.', err);
          } else {
            console.log('Pipeline succeeded.');
          }
        },
      );

      const result =
        (await upload.done()) as CompleteMultipartUploadCommandOutput;

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
