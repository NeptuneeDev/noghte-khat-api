import { Injectable } from '@nestjs/common';
import { Verificaition } from './interfaces/verification.inteface';
import { PrismaService } from '../prisma/prisma.service';
import { VerficationDto } from './Dto/user-signUp.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertVarification(
    user: VerficationDto,
    code: string,
  ): Promise<Verificaition> {
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

  findVarification(email: string): Promise<Verificaition | undefined> {
    return this.prisma.verification.findFirst({ where: { email } });
  }

  async logOut(userId: number): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: null,
      },
    });
    return true;
  }
  async updateRtHash(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hashedRefreshToken,
      },
    });
  }
}
