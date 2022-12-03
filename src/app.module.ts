import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import {ConfigModule} from "@nestjs/config"

@Module({
  imports: [UserModule,PrismaModule,AuthModule,ConfigModule.forRoot({})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
