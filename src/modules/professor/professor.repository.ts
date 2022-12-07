import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorDto } from './Dto/create.professor.Dto';
import { Professor } from './professor.interface';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(name: string): Promise<Professor[] | undefined> {
    return this.prisma.professor.findMany({ where: { name } });
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

  async findByUni(university: string):Promise<Professor[]> {
    return this.prisma.professor.findMany({
      where: { university },
    });
  }
}
