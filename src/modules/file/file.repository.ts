import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { File as FileModel } from '@prisma/client';
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

  async delete(id: number): Promise<FileModel> {
    return this.prisma.file.delete({ where: { id: id } });
  }
}
