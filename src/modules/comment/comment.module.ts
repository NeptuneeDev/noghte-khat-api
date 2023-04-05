import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { ProfessorModule } from '../professor/professor.module';
import { ProfessorRepository } from '../professor/professor.repository';

@Module({
  imports: [ProfessorModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, ProfessorRepository],
})
export class CommentModule {}
