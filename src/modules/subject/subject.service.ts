import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-update.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
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
    if (!proffessor) throw new NotFoundException('professor not found!');

    const subject = await this.subjectRepository.create(createSubjectDto, id);
    return subject;
  }

  async findById(id: number): Promise<Subject | undefined> {
    const subject = await this.subjectRepository.findOne(id);
    if (!subject)
      throw new HttpException("subject isn't found ", HttpStatus.NOT_FOUND);

    return subject;
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects;
  }
  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectRepository.update(id, updateSubjectDto);
  }

  async findUnverifieds(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findUnverifieds();
    return subjects;
  }

  async accept(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject)
      throw new HttpException('not found subject', HttpStatus.NOT_FOUND);
    const acceptedSubject = await this.subjectRepository.accept(id);
    return acceptedSubject;
  }

  async reject(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject)
      throw new HttpException('not found subject', HttpStatus.NOT_FOUND);
    const rejectedSubject = await this.subjectRepository.reject(id);
    return rejectedSubject;
  }
}
