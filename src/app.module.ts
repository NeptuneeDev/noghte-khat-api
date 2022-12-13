import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './modules/common/guards/at.guard';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ConfigModule.forRoot({})],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
