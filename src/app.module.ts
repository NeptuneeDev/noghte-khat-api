import {
  MiddlewareConsumer,
  Module,
  NestModule,
  CacheModule,
} from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfessorModule } from './modules/professor/professor.module';
import { LoggerMiddleware } from './common/utils/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './modules/auth/guards/at.guard';
import { AllExpectionsFilter } from './common/expections/http.expection.filter';
import { SubjectModule } from './modules/subject/subject.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { FileModule } from './modules/file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { S3ManagerModule } from './modules/s3-manager/s3-manager.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { PassportModule } from '@nestjs/passport';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ProfessorModule,
    SubjectModule,
    FileModule,
    CommentModule,
    S3ManagerModule,
    ConfigModule.forRoot(),
    MulterModule.register(),
    CacheModule.register({ isGlobal: true }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY,
        endpoint: process.env.LIARA_ENDPOINT,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'google',
      session: false,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExpectionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
