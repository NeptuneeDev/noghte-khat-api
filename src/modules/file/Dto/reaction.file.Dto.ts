import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import clientMessages from 'src/common/translation/fa';

export enum ReactionType {
  like = 'like',
  dislike = 'dislike',
}

export class ReactionDto {
  @ApiProperty({
    description: 'The type of reaction (like or dislike)',
    enum: ReactionType,
  })
  @IsString()
  @IsEnum(ReactionType, { message: clientMessages.file.reaction.likeOrDislike })
  type: ReactionType;
}
