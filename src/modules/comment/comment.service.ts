import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(
    createCommentDto: CreateCommentDto,
    professorId: number,
    userId: number,
  ): Promise<Comment> {
    const comment = this.commentRepository.findByUserAndProfessorId(
      userId,
      professorId,
    );
    if (comment) {
      throw new BadRequestException(
        'You have already registered a comment for this professor',
      );
    }

    return await this.commentRepository.create(
      createCommentDto,
      professorId,
      userId,
    );
  }

  async accept(id: number) {
    const comment = this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    return this.commentRepository.accept(id);
  }

  findAll(professorId: number) {
    return this.commentRepository.findAll(professorId);
  }

  findOne(id: number) {
    return this.commentRepository.findById(id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.findByIdAndUpdate(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.findByIdAndDelete(id);
  }
}
