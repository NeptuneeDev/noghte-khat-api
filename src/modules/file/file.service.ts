import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SubjectService } from '../subject/subject.service';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { FileRepository } from './file.repository';
import { File } from '../../common/interfaces/file.interface';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { File as FileModel } from '@prisma/client';
// import { Success } from '../auth/types/success.return.type';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly subjectService: SubjectService,
    private readonly s3: S3ManagerService,
  ) {}
  async saveFile(
    subjectId: number,
    file: File,
    uploadFileDto: UploadedFileDto,
  ){
    const subject = await this.subjectService.findById(subjectId);
    if (!subject) throw new BadRequestException('subject id not valid!');

    const saveToStorage = await this.s3.uploadFile('jozveh', file);

    const saveToDB = await this.fileRepository.saveFile(
      subjectId,
      file.originalname,
      uploadFileDto,
    );

    return { success: true };
  }

  async deleteFile(fileName: string) {
    const file = await this.fileRepository.findByName(fileName);

    if (!file)
      throw new BadRequestException('there is no file with this name.');

    const deletedFile = await this.fileRepository.reject(file.id);
    const deletedFromStorage = await this.s3.deleteFile(
      'jozveh',
      file.fileName,
    );

    return { sucess: true };
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
}
