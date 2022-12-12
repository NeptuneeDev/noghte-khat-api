import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils/logger.middleware';
import { ProfessorModule } from './modules/professor/professor.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ProfessorModule,ConfigModule.forRoot({})],
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
