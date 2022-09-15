import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import * as stream from 'stream';
import { imageSizeMapping, parseFileName } from './utils';

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
    image: string,
    file: Buffer,
    size: keyof typeof imageSizeMapping,
  ): Promise<string> {
    const [fileName, extension] = parseFileName(image);
    const Key = fileName + '_' + size + '.' + extension;
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
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      stream.Readable.from(file).pipe(passThroughStream);
      await parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }

    return image;
  }
}
