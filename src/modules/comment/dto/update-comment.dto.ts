import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @IsString()
  description: string;
}
