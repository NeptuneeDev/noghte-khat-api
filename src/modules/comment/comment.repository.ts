import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(professorId: number) {
    return this.prisma.comment.findMany({ where: { professorId } });
  }

  async findByUserAndProfessorId(
    userId: number,
    professorId: number,
  ): Promise<Comment | null> {
    return this.prisma.comment.findFirst({
      where: { userId, professorId },
    });
  }

  async create(
    comment: CreateCommentDto,
    professorId: number,
    userId: number,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        subjectName: comment.subjectName,
        rollcall: comment.rollcall,
        type: comment.type,
        teaching: comment.teaching,
        rhetorical: comment.rhetorical,
        manageClass: comment.manageClass,
        ability: comment.ability,
        semester: comment.semester,
        description: comment.description,
        professor: { connect: { id: professorId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async findById(id: number): Promise<Comment> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async findByIdAndDelete(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async findByIdAndUpdate(id: number, data: object) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  accept(id: number): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data: {
        isVerified: true,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
