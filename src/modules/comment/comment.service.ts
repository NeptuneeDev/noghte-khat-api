import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment, Prisma, Professor, ProfessorRate } from '@prisma/client';
import clientMessages from 'src/common/translation/fa';
import { ProfessorRepository } from '../professor/professor.repository';
import { ProfessorService } from '../professor/professor.service';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly professorRepository: ProfessorRepository,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    professorId: number,
    userId: number,
  ) {
    await this.validateProfessor(professorId);

    await this.checkAlreadyCommented(professorId, userId);

    const comment = await this.commentRepository.comment(
      createCommentDto,
      professorId,
      userId,
    );

    return { success: true };
  }

  async acceptAndUpdateAverge(commentId: number) {
    const comment = await this.validateCommentId(commentId);
    return await this.commentRepository.acceptAndUpdateAverage(
      comment.professorId,
      comment.id,
    );
  }

  async validateCommentId(commentId: number): Promise<Comment | undefined> {
    const comment = await this.commentRepository.findById(commentId);
    console.log(comment);
    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }
    return comment;
  }

  async validateProfessor(id: number): Promise<Professor | undefined> {
    const prof = await this.professorRepository.findById(id);

    if (!prof || !prof.isVerified) {
      throw new BadRequestException(clientMessages.professor.prfessorNorFound);
    }

    return prof;
  }

  async checkAlreadyCommented(professorId: number, userId: number) {
    const userCommentExists =
      await this.commentRepository.findByUserAndProfessorId(
        userId,
        professorId,
      );
    if (userCommentExists) {
      throw new BadRequestException(clientMessages.comment.existsByUser);
    }
  }

  async findByProfessorId(professorId: number) {
    await this.validateProfessor(professorId);
    return await this.commentRepository.getProfessorComments(professorId);
  }

  findOne(id: number) {
    return this.commentRepository.findById(id);
  }

  async update(commentId: number, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.findByIdAndUpdate(
      commentId,
      updateCommentDto,
    );
  }

  async delete(id: number) {
    const comment = await this.validateCommentId(id);
    return await this.commentRepository.findByIdAndDelete(id);
  }
}
