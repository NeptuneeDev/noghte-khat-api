import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
