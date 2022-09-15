import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as mimeTypes from 'mime-types';
import { Observable } from 'rxjs';

@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'];

    const mimeType = mimeTypes.lookup(request.path).toString();

    if (
      !contentType ||
      !mimeType ||
      !mimeType.startsWith('image/') ||
      contentType !== mimeType
    ) {
      throw new HttpException(
        'Invalid image type',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    return true;
  }
}
