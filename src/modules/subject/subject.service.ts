import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectRepository } from './subject.repository';
import { Subject } from './interfaces/subject.interface';
import { ProfessorService } from '../professor/professor.service';
import { Success } from '../auth/doc/types/success.return.type';
import clientMessages from '../../common/translation/fa';

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
    if (!proffessor)
      throw new NotFoundException(clientMessages.professor.prfessorNorFound);

    const subject = await this.subjectRepository.create(createSubjectDto, id);
    return subject;
  }

  async findById(id: number): Promise<Subject | undefined> {
    const subject = await this.subjectRepository.findOne(id);
    if (!subject)
      throw new HttpException(
        clientMessages.subject.subjectNotFound,
        HttpStatus.NOT_FOUND,
      );

    return subject;
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects;
  }
  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject)
      throw new HttpException(
        clientMessages.subject.subjectNotFound,
        HttpStatus.NOT_FOUND,
      );

    return await this.subjectRepository.update(id, updateSubjectDto);
  }

  async findUnverifieds(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findUnverifieds();
    return subjects;
  }

  async accept(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject)
      throw new HttpException(
        clientMessages.subject.subjectNotFound,
        HttpStatus.NOT_FOUND,
      );
    const acceptedSubject = await this.subjectRepository.accept(id);
    return acceptedSubject;
  }

  async delete(id: number): Promise<Success | undefined> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new HttpException(
        clientMessages.subject.subjectNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.subjectRepository.reject(id);
    return { success: true };
  }
}
