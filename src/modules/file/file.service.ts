import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { join, resolve } from 'path';
import { SubjectService } from '../subject/subject.service';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { FileRepository } from './file.repository';
import { File } from './interfaces/file.interface';
import { existsSync } from 'fs';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly subjectService: SubjectService,
  ) {}
  async saveFile(
    subjectId: number,
    fileName: string,
    uploadFileDto: UploadedFileDto,
  ) {
    const subject = await this.subjectService.findById(subjectId);
    if (!subject) throw new BadRequestException('subject id not valid!');

    const file = await this.fileRepository.saveFile(
      subjectId,
      fileName,
      uploadFileDto,
    );
    return file;
  }

  async findUnverifieds(): Promise<File[]> {
    const files = await this.fileRepository.findUnverifieds();
    return files;
  }

  async accept(id: number): Promise<File> {
    const file = await this.fileRepository.findById(id);

    if (!file) throw new HttpException('not found file', HttpStatus.NOT_FOUND);

    return await this.fileRepository.accept(id);
  }

  async reject(id: number): Promise<File> {
    const file = await this.fileRepository.findById(id);

    if (file) throw new HttpException('not found file', HttpStatus.NOT_FOUND);

    return await this.fileRepository.reject(id);
  }
}
