import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as sharp from 'sharp';
import { ImageSizeMapping } from 'src/utils';

@Injectable()
export class ResizeImageInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const [, imageSize] = request.originalUrl.split('/') as [
      '',
      keyof typeof ImageSizeMapping,
      string,
    ];

    const resizeImage = sharp(request.body as Buffer).resize(
      ImageSizeMapping[imageSize],
    );

    const imageResizer: Record<string, () => Promise<Buffer>> = {
      'image/png': () => resizeImage.png().toBuffer(),
      'image/jpeg': () => resizeImage.jpeg().toBuffer(),
      'image/gif': () => resizeImage.gif().toBuffer(),
      'image/avif': () => resizeImage.avif().toBuffer(),
      'image/webp': () => resizeImage.webp().toBuffer(),
    };

    const contentType = request.headers['content-type'];
    if (!contentType) {
      throw new HttpException(
        'Content-Type header does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = await imageResizer[contentType]();
    request.body = buffer;

    return next.handle().pipe();
  }
}
