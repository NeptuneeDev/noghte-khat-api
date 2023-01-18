import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService,SubjectRepository],
})
export class SubjectModule {}
