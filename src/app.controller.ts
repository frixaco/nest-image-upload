import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ContentTypeGuard } from './guards/content-type.guard';
import { ResizeImageInterceptor } from './interceptors/image.interceptor';
import { imageSizeMapping } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ContentTypeGuard)
  @Post(':image')
  @UseInterceptors(ResizeImageInterceptor)
  uploadimage(
    @Headers('size') size: keyof typeof imageSizeMapping,
    @Param('image') image: string,
    @Body() body: Buffer,
  ) {
    return this.appService.uploadimage(image, body, size);
  }
}
