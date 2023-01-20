import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-lesson.dto';
import { UpdateSubjectDto } from './dto/update-lesson.dto';
import { Subject } from './interfaces/subject.interface';
@Injectable()
export class SubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createSubjectDto: CreateSubjectDto, id: number): Promise<Subject> {
    const lesson = this.prisma.subject.create({
      data: {
        title: createSubjectDto.title,
        professor: { connect: { id: id } },
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    });
    return lesson;
  }

  findAll(): Promise<Subject[]> {
    return this.prisma.subject.findMany({});
  }

  findOne(id: number): Promise<Subject | undefined> {
    return this.prisma.subject.findUnique({ where: { id: id } });
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return this.prisma.subject.update({
      where: { id: id },
      data: { title: updateSubjectDto.title },
    });
  }

  remove(id: number) {
    return this.prisma.subject.delete({ where: { id: id } });
  }
}
