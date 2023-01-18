import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-lesson.dto';
import { UpdateSubjectDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SubjectRepository } from './subject.repository';
import { Subject } from './interfaces/subject.interface';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    id: number,
  ): Promise<Subject> {
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
// api/lesson/1  { professorId:number} //  22
