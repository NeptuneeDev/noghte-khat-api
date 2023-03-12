import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProfessorDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';
import { ProfessorRepository } from './professor.repository';
import * as _ from 'lodash';
import clientMessages from 'src/common/translation/fa';
@Injectable()
export class ProfessorService {
  constructor(private readonly professorRepository: ProfessorRepository) {}

  async create(
    createProfessorDto: CreateProfessorDto,
  ): Promise<Partial<Professor | undefined>> {
    const existsProfessr = await this.findByEmail(createProfessorDto.email);
    if (existsProfessr && !existsProfessr.isVerified)
      throw new BadRequestException(
        clientMessages.professor.professorAlredyExists,
      );
    return this.professorRepository.create(createProfessorDto);
  }

  async findById(id: number): Promise<Professor | undefined> {
    const prof = await this.professorRepository.findById(id);

    if (!prof || !prof.isVerified) {
      throw new BadRequestException(clientMessages.professor.prfessorNorFound);
    }

    return prof;
  }

  async findByName(name: string): Promise<Partial<Professor>[]> {
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
  async findUnverifiedsById(id: number): Promise<Professor | undefined> {
    return this.professorRepository.findById(id);
  }

  async findUnverifids(): Promise<Professor[]> {
    return await this.professorRepository.findUnverifieds();
  }

  async deleteProfessor(id: number): Promise<Professor | undefined> {
    const professor = await this.professorRepository.findById(id);

    if (!professor) {
      throw new HttpException(
        clientMessages.professor.prfessorNorFound,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.professorRepository.deletetProfessor(id);
  }

  async accept(id: number) {
    const professor = await this.professorRepository.findById(id);
    if (!professor) {
      throw new HttpException(
        clientMessages.professor.prfessorNorFound,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.professorRepository.accept(id);
  }

  async reject(id: number) {
    const professor = await this.professorRepository.findById(id);
    if (!professor) {
      throw new HttpException(
        clientMessages.professor.prfessorNorFound,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.professorRepository.reject(id);
  }
}
