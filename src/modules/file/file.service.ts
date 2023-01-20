import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { SubjectService } from '../subject/subject.service';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { FileRepository } from './file.repository';

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
    const file = await this.fileRepository.saveFile(
      subjectId,
      fileName,
      uploadFileDto,
    );
    return file;
  }
  async sayHi() {
    return new Promise((res, rej) => resolve('sadssa'));
  }
}
