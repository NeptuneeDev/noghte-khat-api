import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './interfaces/user.interface';
@Injectable()
export class userRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } });
  }

  findUnique(id: number) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async upsert(user: User): Promise<User> {
    return this.prisma.user.upsert({
      create: {
        name: user.name,
        password: user.password,
        email: user.email,
        updateAt: new Date().toISOString(),
        lastLoggedInTime: new Date().toISOString(),
        status: user.status,
      },
      update: {
        lastLoggedInTime: new Date().toISOString(),
      },
      where: { email: user.email },
    });
  }
}
