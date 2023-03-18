import { Injectable } from '@nestjs/common';
import { PartiQLBatchResponse } from 'aws-sdk/clients/dynamodb';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './interfaces/user.interface';
@Injectable()
export class userRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(email: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { email: email } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findUnique(id: number) {
    return this.prisma.user.findUnique({ where: { id: id } });
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

  async upsert(user: Partial<User>): Promise<User> {
    return this.prisma.user.upsert({
      create: {
        name: user.name,
        password: user?.password,
        email: user.email,
        updateAt: new Date().toISOString(),
        lastLoggedInTime: new Date().toISOString(),
        role: user.role,
      },
      update: {
        lastLoggedInTime: new Date().toISOString(),
      },
      where: { email: user.email },
    });
  }
  async create(user: Partial<User>) {
    return this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        updateAt: new Date().toISOString(),
        lastLoggedInTime: new Date().toISOString(),
        password: user?.password,
        role: user.role,
      },
    });
  }
  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(id: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }
}
