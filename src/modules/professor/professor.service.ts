import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './Dto/create.professor.Dto';
import { Professor } from './professor.interface';
import { ProfessorRepository } from './professor.repository';

@Injectable()
export class ProfessorService {
  constructor(private readonly professorRepository: ProfessorRepository) {}

  async create(createProfessorDto: CreateProfessorDto) {
    return this.professorRepository.create(createProfessorDto);
  }

  async find(name: string): Promise<Professor[]> {
    const professors = await this.professorRepository.find(name);
    return professors;
  }

  async findByUni(university: string): Promise<Professor[]> {
    const professors = await this.professorRepository.findByUni(university);
    return professors;
  }
}
