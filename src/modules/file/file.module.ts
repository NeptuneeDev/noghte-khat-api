import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { SubjectModule } from './../subject/subject.module';
import { SubjectRepository } from '../subject/subject.repository';
import { SubjectService } from '../subject/subject.service';
import { ProfessorModule } from '../professor/professor.module';
@Module({
  imports: [SubjectModule, ProfessorModule],
  controllers: [FileController],
  providers: [FileRepository, SubjectRepository, SubjectService, FileService],
})
export class FileModule {}
