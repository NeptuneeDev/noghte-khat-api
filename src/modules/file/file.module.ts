import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { SubjectModule } from './../subject/subject.module';
import { SubjectRepository } from '../subject/subject.repository';
import { SubjectService } from '../subject/subject.service';
import { ProfessorModule } from '../professor/professor.module';
import { S3ManagerModule } from '../s3-manager/s3-manager.module';
@Module({
  imports: [SubjectModule, ProfessorModule, S3ManagerModule],
  controllers: [FileController],
  providers: [FileRepository, SubjectRepository, SubjectService, FileService],
})
export class FileModule {}
