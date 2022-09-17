import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(RawBodyMiddleware).forRoutes(AppController);
//   }
// }
