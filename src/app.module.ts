import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import {ConfigModule} from "@nestjs/config"
import { ProfessorModule } from './modules/professor/professor.module';

@Module({
  imports: [UserModule,PrismaModule,AuthModule,ConfigModule.forRoot({}), ProfessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
