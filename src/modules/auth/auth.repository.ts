import { Injectable } from '@nestjs/common';
import { Verification } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VerficationDto } from './Dto/user-signUp.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertVarification(
    user: VerficationDto,
    code: string,
  ): Promise<Verification> {
    return this.prisma.verification.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        code: code,
        lastResendTime: new Date().toISOString(),
      },
      update: {
        try: { increment: 1 },
        lastResendTime: new Date().toISOString(),
        code: code,
      },
    });
  }

  findVarification(email: string): Promise<Verification | undefined> {
    return this.prisma.verification.findFirst({ where: { email } });
  }
}
