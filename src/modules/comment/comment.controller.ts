import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RtGuard } from '../auth/guards/rt.guard';
import { Role } from '../auth/types/roles.enum';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(RtGuard)
  @Post(':professorId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('professorId') professorId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.commentService.create(createCommentDto, professorId, userId);
  }

  @Get(':professorId')
  findAll(@Param('professorId') professorId: number) {
    return this.commentService.findAll(professorId);
  }

  @Get(':id')
  findOne(@Param('id') commentId: number) {
    return this.commentService.findOne(commentId);
  }

  @Roles(Role.Admin)
  @Get('accept/:id')
  async accept(@Param('id') commentId: number) {
    return await this.commentService.accept(commentId);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  async reject(@Param('id') commentId: number) {
    return await this.commentService.remove(commentId);
  }

  @Delete(':id')
  remove(@Param('id') commentId: number) {
    return this.commentService.remove(commentId);
  }

  @Patch(':id')
  update(
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }
}
