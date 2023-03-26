import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProfessorRate } from '@prisma/client';
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
        description: comment.description,
        presenceRoll: comment.presenceRoll,
        professor: { connect: { id: professorId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async saveRate(professorRate: ProfessorRate) {
    return this.prisma.$transaction(async (ctx) => {
      const rate = await ctx.professorRate.create({
        data: {
          professor: { connect: { id: professorRate.professorId } },
          user: { connect: { id: professorRate.userId } },
          comment: { connect: { id: professorRate.commentId } },
          subjectMastry: professorRate.subjectMastry,
          grading: professorRate.grading,
          teachingCoherence: professorRate.teachingCoherence,
          classRoomManagement: professorRate.classRoomManagement,
        },
      });


      const numberOfRaters = await ctx.professorRate.count({
        where: {
          professorId: professorRate.professorId,
        },
      });

      const rates = await ctx.professorRate.findMany({
        where: {
          professorId: professorRate.professorId,
        },
      });

      const sum = rates.reduce(
        (accumulator, currentRate) => {
          return {
            subjectMastry: accumulator.subjectMastry.add(
              currentRate.subjectMastry,
            ),
            classRoomManagement: accumulator.classRoomManagement.add(
              currentRate.classRoomManagement,
            ),
            teachingCoherence: accumulator.teachingCoherence.add(
              currentRate.teachingCoherence,
            ),
            grading: accumulator.grading.add(currentRate.grading),
          };
        },
        {
          subjectMastry: new Prisma.Decimal(0),
          classRoomManagement: new Prisma.Decimal(0),
          teachingCoherence: new Prisma.Decimal(0),
          grading: new Prisma.Decimal(0),
        },
      );



      const average = {
        subjectMastry: sum.subjectMastry.div(numberOfRaters).toFixed(1), 
        classRoomManagement: sum.classRoomManagement
          .div(numberOfRaters)
          .toFixed(1),
        teachingCoherence: sum.teachingCoherence.div(numberOfRaters).toFixed(1),
        grading: sum.grading.div(numberOfRaters).toFixed(1),
      };



      await ctx.professor.update({
        where: {
          id: professorRate.professorId,
        },
        data: {
          averageClassRoomManagement: +average.classRoomManagement,
          averageSubjectMastry: +average.subjectMastry,
          averageTeachingCoherence: +average.teachingCoherence,
          averageGrading: +average.grading,
        },
      });
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
