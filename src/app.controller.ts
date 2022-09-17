import {
  Controller,
  Headers,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ContentTypeGuard } from './content-type.guard';
import { ImageSize } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ContentTypeGuard)
  @Post(':filename')
  async uploadImage(
    @Req() request: Request,
    @Res() response: Response,
    @Param('filename') filename: string,
    @Headers('size') size: ImageSize,
  ): Promise<{ filename: string; url: string }> {
    return this.appService.uploadImage(request, response, filename, size);
  }
}
