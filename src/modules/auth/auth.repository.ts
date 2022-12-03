import { Injectable } from '@nestjs/common';
import { Verificaiton } from '../interfacses/verification.inteface';
import { PrismaService } from '../prisma/prisma.service';
import { UserSignUpDto } from './Dto/user-signUp.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertVarification(
    user: UserSignUpDto,
    code: string,
  ): Promise<Verificaiton> {
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

  findVarification(email: string): Promise<Verificaiton | undefined> {
    return this.prisma.verification.findFirst({ where: { email } });
  }
}
