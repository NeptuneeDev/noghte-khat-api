import { Injectable } from '@nestjs/common';
import prisma from '@prisma/client';
import { emitWarning } from 'process';
import { Varificaiton } from '../interfacses/varification.inteface';
import { PrismaService } from '../prisma/prisma.service';
import { UserLoginDto } from './Dto/user-login.Dto';
import { UserSignInDto } from './Dto/user-signin.dto';

@Injectable()
export class userRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertVarification(user: UserSignInDto) {
    this.prisma.verification.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        code: 22,
        lastResendTime: new Date().toISOString(),
      },
      update: {
        try: { increment: 1 },
        lastResendTime: new Date().toISOString(),
        code: 22,
      },
    });
  }
  find(user: UserSignInDto) {
    return this.prisma.user.findFirst({ where: { email: user.email } });
  }

  findVarification(email: string): Promise<Varificaiton | undefined> {
    return this.prisma.verification.findFirst({ where: { email } });
  }
}
