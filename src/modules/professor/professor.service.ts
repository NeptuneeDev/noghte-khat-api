import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { relative } from 'path/win32';
import { CreateProfessorDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';
import { ProfessorRepository } from './professor.repository';
import * as _ from 'lodash';
@Injectable()
export class ProfessorService {
  constructor(private readonly professorRepository: ProfessorRepository) {}

  async create(createProfessorDto: CreateProfessorDto) {
    return this.professorRepository.create(createProfessorDto);
  }

  async findById(id: number): Promise<Professor | undefined> {
    return await this.professorRepository.findById(id);
  }

  async findByName(name: string): Promise<Partial<Professor>[]> {
    const professors = await this.professorRepository.findByName(name);
    return professors.map((pro) =>
      _.omit(pro, ['createdAt', 'updatedAt', 'email', "university"]),
    );
  }

  async findByUni(university: string): Promise<Professor[]> {
    const professors = await this.professorRepository.findByUni(university);
    return professors;
  }

  async findAll(): Promise<Professor[]> {
    return await this.professorRepository.findAll();
  }

  async deleteProfessor(id: number): Promise<Professor | undefined> {
    const professor = await this.professorRepository.findById(id);

    if (!professor) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    return await this.professorRepository.deletetProfessor(id);
  }
}
