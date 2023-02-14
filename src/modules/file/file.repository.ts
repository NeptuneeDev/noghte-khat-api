import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { File as FileModel } from '@prisma/client';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(
    subjectId: number,
    fileName: string,
    uploadFileDto: UploadedFileDto,
  ): Promise<object> {
    return this.prisma.file.create({
      data: {
        title: uploadFileDto.title,
        fileName: fileName,
        description: uploadFileDto.description,
        subject: { connect: { id: subjectId } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async findById(id: number): Promise<object> {
    return this.prisma.file.findUnique({ where: { id: id } });
  }

  async findByName(fileName: string) {
    return await this.prisma.file.findFirst({ where: { fileName: fileName } });
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

  async reject(id: number): Promise<FileModel> {
    return this.prisma.file.delete({ where: { id: id } });
  }
}
