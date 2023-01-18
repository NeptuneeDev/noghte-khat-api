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

  async create(
    createProfessorDto: CreateProfessorDto,
  ): Promise<Partial<Professor | undefined>> {
    const existsProfessr = await this.findByEmail(createProfessorDto.email);
    console.log(existsProfessr);
    if (existsProfessr)
      throw new BadRequestException(
        "professor with this email already exists,please change email or do with existed professor's  prifle...",
      );
    return this.professorRepository.create(createProfessorDto);
  }

  async findById(id: number): Promise<Professor | undefined> {
    const prof = await this.professorRepository.findById(id);

    if (prof) return prof;
    else throw new HttpException('NOT found prof', HttpStatus.NOT_FOUND);
  }

  async findByName(name: string): Promise<Partial<Professor>[]> {
    console.log('here');
    const professors = await this.professorRepository.findByName(name);
    return professors.map((pro) => _.omit(pro, ['createdAt', 'updatedAt']));
  }

  async findByUni(university: string): Promise<Partial<Professor>[]> {
    const professors = await this.professorRepository.findByUni(university);
    return professors.map((pro) =>
      _.omit(pro, ['createdAt', 'updatedAt', 'email']),
    );
  }
  async findByEmail(email: string): Promise<Partial<Professor>> {
    const professor = await this.professorRepository.findByEmail(email);
    return professor;
  }

  async findAll(): Promise<Professor[]> {
    return await this.professorRepository.findAll();
  }

  async deleteProfessor(id: number): Promise<Professor | undefined> {
    const professor = await this.professorRepository.findById(id);

    if (!professor) {
      throw new HttpException('professor not found', HttpStatus.NOT_FOUND);
    }

    return await this.professorRepository.deletetProfessor(id);
  }
}

/// model for email that is unique

// api/professor/university/  body{"uni":""}
