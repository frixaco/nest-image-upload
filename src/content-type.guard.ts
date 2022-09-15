import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'];

    if (!contentType || !contentType.startsWith('image/')) {
      throw new HttpException(
        'Invalid Content-Type header. Should be image/*',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    return true;
  }
}
