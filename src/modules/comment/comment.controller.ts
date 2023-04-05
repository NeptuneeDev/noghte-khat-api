import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RtGuard } from '../auth/guards/rt.guard';
import { Role } from '../auth/types/roles.enum';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReactionDto } from './dto/reaction.file.Dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get('unverifieds')
  async getUnverifieds() {
    console.log('hi there');
    return await this.commentService.getUnverifieds();
  }

  @Post(':professorId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('professorId') professorId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.commentService.create(createCommentDto, professorId, userId);
  }

  @Public()
  @Get(':professorId')
  async findAll(@Param('professorId') professorId: number) {
    return await this.commentService.findByProfessorId(professorId);
  }

  @Roles(Role.Admin)
  @Post('accept/:id')
  async accept(@Param('id') commentId: number) {
    return await this.commentService.acceptAndUpdateAverge(commentId);
  }

  @Roles(Role.Admin)
  @Delete('reject/:id')
  async reject(@Param('id') commentId: number) {
    return await this.commentService.delete(commentId);
  }

  @Patch(':id')
  async update(
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Post(':commentId/react')
  async react(
    @GetCurrentUserId() userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() reaction: ReactionDto,
  ) {
    return await this.commentService.saveUserReaction(
      userId,
      commentId,
      reaction.type,
    );
  }

  @Get(':professorId/userReactions')
  async reara(
    @GetCurrentUserId() userId: number,
    @Param('professorId', ParseIntPipe) professorId: number,
  ) {
    return await this.commentService.getUserReactionToCommentsOfProfessor(
      userId,
      professorId,
    );
  }
}
