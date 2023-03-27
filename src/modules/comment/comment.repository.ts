import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProfessorRate } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';
@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndProfessorId(
    userId: number,
    professorId: number,
  ): Promise<Comment | null> {
    return this.prisma.comment.findFirst({
      where: { userId, professorId },
    });
  }

  async comment(
    createCommentDto: CreateCommentDto,
    professorId: number,
    userId: number,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        subjectName: createCommentDto.subjectName,
        description: createCommentDto.description,
        presenceRoll: createCommentDto.presenceRoll,
        professor: { connect: { id: professorId } },
        user: { connect: { id: userId } },
        professorRate: {
          create: {
            subjectMastry: new Prisma.Decimal(createCommentDto.subjectMastry),
            classRoomManagement: new Prisma.Decimal(
              createCommentDto.classRoomManagement,
            ),
            teachingCoherence: new Prisma.Decimal(
              createCommentDto.teachingCoherence,
            ),
            grading: new Prisma.Decimal(createCommentDto.grading),
            professor: { connect: { id: professorId } },
            user: { connect: { id: userId } },
          },
        },
      },
    });
  }

  updateProfessorAverages(
    ctx: Prisma.TransactionClient,
    professorId: number,
    average,
  ) {
    return ctx.professor.update({
      where: {
        id: professorId,
      },
      data: {
        averageClassRoomManagement: +average.classRoomManagement,
        averageSubjectMastry: +average.subjectMastry,
        averageTeachingCoherence: +average.teachingCoherence,
        averageGrading: +average.grading,
      },
    });
  }

  async findProfessorRates(
    ctx: Prisma.TransactionClient,
    professorId: number,
  ): Promise<ProfessorRate[]> {
    return ctx.professorRate.findMany({
      where: {
        professorId: professorId,
        comment: {
          isVerified: true,
        },
      },
    });
  }

  calculateAverage(rates: ProfessorRate[], numberOfRaters: number) {
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

    return average;
  }

  async findById(id: number): Promise<Comment> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async findByIdAndDelete(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async findByIdAndUpdate(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: {
        description: updateCommentDto.description,
      },
    });
  }

  async acceptAndUpdateAverage(professorId: number, commentId: number) {
    return this.prisma.$transaction(async (ctx) => {
      const accepted = await ctx.comment.update({
        where: { id: commentId },
        data: {
          isVerified: true,
        },
      });

      const rates = await this.findProfessorRates(ctx, professorId);
      const numberOfRaters = rates.length;

      const average = this.calculateAverage(rates, numberOfRaters);
      await this.updateProfessorAverages(ctx, professorId, average);
    });
  }

  getProfessorComments(professorId: number) {
    return this.prisma.comment.findMany({
      where: { professorId: professorId, isVerified: true },
      select: {
        id: true,
        subjectName: true,
        presenceRoll: true,
        description: true,
        isVerified: true,
        professorId: true,
        createdAt: true,
        updatedAt: true,

        professorRate: {
          select: {
            subjectMastry: true,
            classRoomManagement: true,
            teachingCoherence: true,
            grading: true,
          },
        },
      },
    });
  }
}
