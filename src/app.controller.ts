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
  @Post(':image')
  // @UseInterceptors(ResizeImageInterceptor)
  async uploadimage(
    @Headers('size') size: ImageSize,
    @Param('image') image: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<{ filename: string; url: string }> {
    return this.appService.uploadimage(request, response, image, size);
  }
}
