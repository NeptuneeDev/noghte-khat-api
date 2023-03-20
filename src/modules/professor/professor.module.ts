import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { ProfessorRepository } from './professor.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenInterceptor } from 'src/common/interceptors/token.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [ProfessorController],
  providers: [ProfessorService, ProfessorRepository, PrismaService],
  exports: [ProfessorService],
})
export class ProfessorModule {}
