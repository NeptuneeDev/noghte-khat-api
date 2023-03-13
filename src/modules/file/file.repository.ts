import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { DisLikeFile, File as FileModel, LikeFile } from '@prisma/client';
import { UpdateFileDto } from './Dto/update.file.Dto';

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

  async like(userId: number, fileId: number): Promise<LikeFile> {
    return await this.prisma.likeFile.create({
      data: {
        user: {
          connect: { id: userId },
        },
        file: {
          connect: { id: fileId },
        },
      },
    });
  }

  async removalLike(userId: number, fileId: number): Promise<LikeFile> {
    return await this.prisma.likeFile.delete({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
    });
  }

  async getNumberOFlikes(fileId: number): Promise<number> {
    return await this.prisma.likeFile.count({ where: { fileId: fileId } });
  }

  async disLike(userId: number, fileId: number): Promise<DisLikeFile> {
    return await this.prisma.disLikeFile.create({
      data: {
        user: {
          connect: { id: userId },
        },
        file: {
          connect: { id: fileId },
        },
      },
    });
  }

  async removalDisLike(userId: number, fileId: number): Promise<DisLikeFile> {
    return await this.prisma.disLikeFile.delete({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
    });
  }

  async getNumberOFDisLikes(fileId: number): Promise<number> {
    return await this.prisma.disLikeFile.count({ where: { fileId: fileId } });
  }

  async userHasLikedFile(
    userId: number,
    fileId: number,
  ): Promise<LikeFile | undefined> {
    return await this.prisma.likeFile.findUnique({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
    });
  }

  async userHasDisLikedFile(
    userId: number,
    fileId: number,
  ): Promise<DisLikeFile | undefined> {
    return await this.prisma.likeFile.findUnique({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
    });
  }

  async delete(id: number): Promise<FileModel> {
    return this.prisma.file.delete({ where: { id: id } });
  }
}
