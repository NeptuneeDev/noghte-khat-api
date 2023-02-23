import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SubjectService } from '../subject/subject.service';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { FileRepository } from './file.repository';
import { File } from '../../common/interfaces/file.interface';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { File as FileModel } from '@prisma/client';
import * as mime from 'mime-types';
import { UpdateFileDto } from './Dto/update.file.Dto';
import { Success } from '../auth/doc/types/success.return.type';
import { bool } from 'aws-sdk/clients/signer';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly subjectService: SubjectService,
    private readonly s3: S3ManagerService,
  ) {}
  async saveFile(subjectId: number, file: File, uploadFileDto: UploadFileDto) {
    const subject = await this.subjectService.findById(subjectId);
    if (!subject) {
      throw new BadRequestException('subject id not valid!');
    }

    if (!this.isValidType(file.mimetype))
      throw new HttpException('File type not valid!', HttpStatus.FORBIDDEN);
      
    const size = Math.round(file.size / 1000);
    const fileType = `${mime.extension(file.mimetype)}`;

    const saveToStorage = await this.s3.uploadFile('jozveh', file);

    await this.fileRepository.saveFile(
      subject.id,
      saveToStorage.key,
      fileType,
      size,
      uploadFileDto,
    );

    return { success: true };
  }

  async deleteFile(id: number) {
    const file = await this.fileRepository.findById(id);

    if (!file) throw new BadRequestException('File Not Found');

    await this.s3.deleteFile('jozveh', file.fileName);
    await this.fileRepository.delete(id);

    return { sucess: true };
  }

  async update(
    id: number,
    updateFileDto: UpdateFileDto,
  ): Promise<Success | undefined> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new BadRequestException('file not found');
    }
    await this.fileRepository.update(id, updateFileDto);
    return { success: true };
  }
  async findUnverifieds(): Promise<FileModel[]> {
    const files = await this.fileRepository.findUnverifieds();
    return files;
  }

  async accept(id: number): Promise<FileModel> {
    const file = await this.fileRepository.findById(id);

    if (!file) throw new HttpException('not found file', HttpStatus.NOT_FOUND);

    return await this.fileRepository.accept(id);
  }

  isValidType(mimeType: string): Boolean {
    const allowedFileExtensions = [
      'pdf',
      'doc',
      'docx',
      'word',
      'pptx',
      'txt',
      'jpg',
      'png',
    ];
    const fileExt = `${mime.extension(mimeType)}`;

    if (allowedFileExtensions.includes(fileExt)) {
      return true;
    }

    return false;
  }
}
