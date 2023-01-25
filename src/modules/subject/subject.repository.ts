import { Injectable } from '@nestjs/common';
import { includes } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-update.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
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
    return this.prisma.subject.findMany({ where: { isVerified: true } });
  }
  findByName(name: string): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: {
        title: { contains: name },
        isVerified: true,
      },
    });
  }
  findOne(id: number): Promise<Subject | undefined> {
    return this.prisma.subject.findUnique({
      where: { id: id },
      include: { file: true },
    });
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return this.prisma.subject.update({
      where: { id: id },
      data: {
        ...updateSubjectDto,
        isVerified: false,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  findById(id: number): Promise<Subject> {
    return this.prisma.subject.findUnique({ where: { id: id } });
  }

  findUnverifieds(): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: { isVerified: false },
      include: { professor: true },
    });
  }

  accept(id: number): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id: id },
      data: {
        isVerified: true,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  reject(id: number): Promise<Subject> {
    return this.prisma.subject.delete({ where: { id: id } });
  }
}
