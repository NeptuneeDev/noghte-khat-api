import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProfessorRate } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReactionType } from './dto/reaction.comment.Dto';
import { Decimal } from '@prisma/client/runtime';
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

  calculateAverageRates(rateFields: string[]): Prisma.Decimal {
    const sum = rateFields.reduce((sum, current) => {
      return sum.add(new Prisma.Decimal(current));
    }, new Prisma.Decimal('0'));

    return sum.div(rateFields.length);
  }

  async comment(
    createCommentDto: CreateCommentDto,
    professorId: number,
    userId: number,
  ): Promise<Comment> {
    const { subjectMastry, classRoomManagement, teachingCoherence, grading } =
      createCommentDto;
    const averageRates = this.calculateAverageRates([
      subjectMastry,
      classRoomManagement,
      teachingCoherence,
    ]);
    return this.prisma.comment.create({
      data: {
        subjectName: createCommentDto.subjectName,
        description: createCommentDto.description,
        presenceRoll: createCommentDto.presenceRoll,
        educationResources: createCommentDto.educationResource,
        averageRates: averageRates,
        professor: { connect: { id: professorId } },
        user: { connect: { id: userId } },
        professorRate: {
          create: {
            subjectMastry: new Prisma.Decimal(subjectMastry),
            classRoomManagement: new Prisma.Decimal(classRoomManagement),
            teachingCoherence: new Prisma.Decimal(teachingCoherence),
            grading: new Prisma.Decimal(grading),
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

  getCommentsToProfessorAndUserReactions(professorId: number, userId: number) {
    return this.prisma.comment.findMany({
      where: { professorId: professorId, isVerified: true },
      select: {
        id: true,
        subjectName: true,
        presenceRoll: true,
        averageRates: true,
        educationResources: true,
        description: true,
        isVerified: true,
        professorId: true,
        numberOfDisLikes: true,
        numberOfLikes: true,
        createdAt: true,
        updatedAt: true,

        UserCommentReactions: {
          where: {
            userId,
          },
          select: {
            reaction: true,
          },
        },
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

  async getUnverified(): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { isVerified: false },
      include: {
        professorRate: true,
      },
    });
  }

  async getReactOf(userId: number, commentId: number) {
    return await this.prisma.userCommentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId: commentId,
          userId: userId,
        },
      },
    });
  }

  async saveUserReaction(
    userId: number,
    commentId: number,
    reaction: ReactionType,
  ) {
    await this.prisma.$transaction(async (ctx) => {
      await this.prisma.userCommentReaction.upsert({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
        update: {
          reaction: reaction,
        },
        create: {
          userId,
          commentId,
          reaction: reaction,
        },
      });

      const numberOfLikes = await ctx.userCommentReaction.count({
        where: { commentId, reaction: 'like' },
      });

      const numberOfDisLikes = await ctx.userCommentReaction.count({
        where: { commentId, reaction: 'dislike' },
      });

      await ctx.comment.update({
        where: { id: commentId },
        data: {
          numberOfLikes,
          numberOfDisLikes,
        },
      });
    });
  }
  async removeUserReaction(userId: number, commentId: number) {
    await this.prisma.$transaction(async (ctx) => {
      await this.prisma.userCommentReaction.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });

      const numberOfLikes = await ctx.userCommentReaction.count({
        where: { commentId, reaction: 'like' },
      });

      const numberOfDisLikes = await ctx.userCommentReaction.count({
        where: { commentId, reaction: 'dislike' },
      });

      await ctx.comment.update({
        where: { id: commentId },
        data: {
          numberOfLikes,
          numberOfDisLikes,
        },
      });
    });
  }
  // async getCommentsToProfessorAndUserReactions(
  //   userId: number,
  //   professorId: number,
  // ) {
  //   return this.prisma.comment.findMany({
  //     where: {
  //       professor: {
  //         id: professorId,
  //       },
  //       reactions: {
  //         some: {
  //           user: {
  //             id: userId,
  //           },
  //         },
  //       },
  //     },
  //     select: {
  //       reactions: {
  //         select: {
  //           reaction: true,
  //           commentId: true,
  //         },
  //       },
  //     },
  //   });
  // }
}
