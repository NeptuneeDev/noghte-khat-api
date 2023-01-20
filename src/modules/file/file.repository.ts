import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { File } from './interfaces/file.interface';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(
    subjectId: number,
    fileName: string,
    uploadFileDto: UploadedFileDto,
  ): Promise<File> {
    return this.prisma.file.create({
      data: {
        title: uploadFileDto.title,
        fileName: fileName,
        description: uploadFileDto.description,
        subjectId: subjectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
