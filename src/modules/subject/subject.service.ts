import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-lesson.dto';
import { UpdateSubjectDto } from './dto/update-lesson.dto';
import { SubjectRepository } from './subject.repository';
import { Subject } from './interfaces/subject.interface';
import { ProfessorService } from '../professor/professor.service';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly professorService: ProfessorService,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    id: number,
  ): Promise<Subject> {
    const proffessor = await this.professorService.findById(id);
    const subject = await this.subjectRepository.create(createSubjectDto, id);
    return subject;
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects;
  }
  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectRepository.update(id, updateSubjectDto);
  }
  remove(id: number): Promise<Subject> {
    return this.subjectRepository.remove(id);
  }
}
