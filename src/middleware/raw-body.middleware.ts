import { Injectable, NestMiddleware } from '@nestjs/common';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    bodyParser.raw({
      type: 'image/*',
      limit: process.env.MAX_IMAGE_SIZE || '1mb',
    })(req, res, next);
  }
}
