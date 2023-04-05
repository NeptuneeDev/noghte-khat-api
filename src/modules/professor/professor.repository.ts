import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Professor[] | undefined> {
    return this.prisma.professor.findMany({
      where: {
        name: {
          contains: name,
        },
        isVerified: true,
      },
    });
  }

  async create(professorDto: CreateProfessorDto): Promise<Professor> {
    return this.prisma.professor.create({
      data: {
        name: professorDto.name,
        email: professorDto.email,
        university: professorDto.university,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    });
  }

  async findByUni(university: string): Promise<Professor[]> {
    return this.prisma.professor.findMany({
      where: { university: { contains: university }, isVerified: true },
    });
  }

  async findByEmail(email: string): Promise<Professor | undefined> {
    return this.prisma.professor.findUnique({
      where: { email: email },
    });
  }

  async findAll(): Promise<Professor[]> {
    return this.prisma.professor.findMany({ where: { isVerified: true } });
  }

  async deletetProfessor(id: number) {
    return this.prisma.professor.delete({ where: { id } });
  }

  async getProfessorAndReactions(
    id: number,
    userId: number,
  ): Promise<Professor | undefined> {
    return this.prisma.professor.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { isVerified: true },
          include: {
            files: {
              orderBy: [{ id: 'asc' }],
              where: { isVerified: true },
              include: {
                UserFileReactions: {
                  where: { userId: userId },
                },
              },
            },
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Professor | undefined> {
    return this.prisma.professor.findUnique({
      where: {id },
    });
  }

  async findUnverifieds(): Promise<Professor[]> {
    return this.prisma.professor.findMany({ where: { isVerified: false } });
  }

  async accept(id: number): Promise<Professor> {
    return this.prisma.professor.update({
      where: { id: id },
      data: {
        isVerified: true,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async reject(id: number) {
    return this.prisma.professor.delete({ where: { id: id } });
  }
}
