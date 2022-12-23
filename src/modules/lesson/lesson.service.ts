import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto, id: number) {
    const lesson = this.prisma.lesson.create({
      data: {
        title: createLessonDto.tilte,
        professor: { connect: { id: id } },
      },
    });
    return lesson;
  }

  findAll() {
    return this.prisma.lesson.findMany({});
  }

  findOne(id: number) {
    return this.prisma.lesson.findUnique({ where: { id: id } });
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: { id: id },
      data: { title: updateLessonDto.tilte },
    });
  }

  remove(id: number) {
    return this.prisma.lesson.delete({ where: { id: id } });
  }
}
