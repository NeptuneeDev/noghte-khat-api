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
      },
    });
  }

  async create(professorDto: CreateProfessorDto): Promise<Professor> {
    console.log('here');
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
      where: { university: { contains: university } },
    });
  }

  async findByEmail(email: string): Promise<Professor | undefined> {
    return this.prisma.professor.findUnique({
      where: { email: email },
    });
  }

  async findAll(): Promise<Professor[]> {
    return this.prisma.professor.findMany();
  }

  async deletetProfessor(id: number) {
    return this.prisma.professor.delete({ where: { id } });
  }

  async findById(id: number): Promise<Professor | undefined> {
    return this.prisma.professor.findFirst({
      where: { id },
      include: { lessons: true },
    });
  }
}
