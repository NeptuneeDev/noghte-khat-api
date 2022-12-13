import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils/logger.middleware';
<<<<<<< HEAD
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
=======
import { ProfessorModule } from './modules/professor/professor.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ProfessorModule,ConfigModule.forRoot({})],
>>>>>>> 842d72d450ee6202c7b53db078c6bed23759caa0
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// subject POST api/subject/

//  profile professor     khalvai    add subject

// name  professorId       

            /////////////////////////////////////////////// +
            ///////////////////////////////////////////////

            ///////////////////////////////////////////////
            ///////////////////////////////////////////////


            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
