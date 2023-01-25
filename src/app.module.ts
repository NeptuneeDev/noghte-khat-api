import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfessorModule } from './modules/professor/professor.module';
import { LoggerMiddleware } from './common/utils/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { AllExpectionsFilter } from './common/expections/http.expection.filter';
import { SubjectModule } from './modules/subject/subject.module';
import { RolesGuard } from './common/guards/roles.guard';
import { FileModule } from './modules/file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ProfessorModule,
    SubjectModule,
    ConfigModule.forRoot({}),
    FileModule,
    MulterModule.register({ dest: './uploads' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/files/',
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
