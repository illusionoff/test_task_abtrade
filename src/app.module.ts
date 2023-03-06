import { Module, NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CorsMiddleware } from '@nestjs/common';
import * as cors from 'cors';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cors()).forRoutes('*');
  }
}
