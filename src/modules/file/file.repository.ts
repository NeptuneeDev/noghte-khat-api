import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { UpdateFileDto } from './Dto/update.file.Dto';
import { File as FileModel } from '@prisma/client';
import { ReactionType } from './Dto/reaction.file.Dto';
@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(
    subjectId: number,
    fileName: string,
    type: string,
    size: number,
    uploadFileDto: UploadFileDto,
  ): Promise<FileModel> {
    return this.prisma.file.create({
      data: {
        title: uploadFileDto.title,
        type: type,
        size: size,
        fileName: fileName,
        description: uploadFileDto.description,
        numberOfDisLikes: 0,
        numberOfLikes: 0,
        subject: { connect: { id: subjectId } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async findById(id: number): Promise<FileModel> {
    return this.prisma.file.findUnique({ where: { id: id } });
  }

  async findByName(fileName: string) {
    return await this.prisma.file.findFirst({ where: { fileName: fileName } });
  }

  async update(
    id: number,
    updateFileDto: UpdateFileDto,
  ): Promise<FileModel | undefined> {
    return this.prisma.file.update({
      where: { id },
      data: {
        title: updateFileDto.title,
        description: updateFileDto.description,
        updatedAt: new Date().toISOString(),
      },
    });
  }
  async findUnverifieds(): Promise<FileModel[]> {
    return this.prisma.file.findMany({
      where: { isVerified: false },
      include: { subject: { include: { professor: true } } },
    });
  }

  async accept(id: number): Promise<FileModel> {
    return this.prisma.file.update({
      where: { id: id },
      data: {
        isVerified: true,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async getReactOf(userId: number, fileId: number) {
    return await this.prisma.userFileReaction.findUnique({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
    });
  }

  async saveUserReaction(
    userId: number,
    fileId: number,
    reaction: 'like' | 'dislike',
  ) {
    await this.prisma.$transaction(async (ctx) => {
      await this.prisma.userFileReaction.upsert({
        where: {
          fileId_userId: {
            fileId,
            userId,
          },
        },
        update: {
          reaction: reaction,
        },
        create: {
          userId,
          fileId,
          reaction: reaction,
        },
      });

      const numberOfLikes = await ctx.userFileReaction.count({
        where: { fileId, reaction: 'like' },
      });

      const numberOfDisLikes = await ctx.userFileReaction.count({
        where: { fileId, reaction: 'dislike' },
      });

      await ctx.file.update({
        where: { id: fileId },
        data: {
          numberOfLikes,
          numberOfDisLikes,
        },
      });
    });
  }

  async removeUserReaction(userId: number, fileId: number) {
    await this.prisma.$transaction(async (ctx) => {
      await this.prisma.userFileReaction.delete({
        where: {
          fileId_userId: {
            fileId,
            userId,
          },
        },
      });

      const numberOfLikes = await ctx.userFileReaction.count({
        where: { fileId, reaction: 'like' },
      });

      const numberOfDisLikes = await ctx.userFileReaction.count({
        where: { fileId, reaction: 'dislike' },
      });

      await ctx.file.update({
        where: { id: fileId },
        data: {
          numberOfLikes,
          numberOfDisLikes,
        },
      });
    });
  }
  async getUserReactedFilesInSubject(userId: number, subjectId) {
    return this.prisma.file.findMany({
      where: {
        subject: {
          id: subjectId,
        },
        UserFileReactions: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },

      select: {
        UserFileReactions: {
          select: {
            reaction: true,
            fileId: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<FileModel> {
    return this.prisma.file.delete({ where: { id: id } });
  }
}
