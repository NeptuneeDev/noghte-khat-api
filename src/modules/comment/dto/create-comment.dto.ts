import { IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { IsValidRatingField, RatingValidator } from './custom.validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCommentDto {


  @ApiProperty()
  @IsString()
  subjectName: string;

  @ApiProperty()
  @IsString()
  presenceRoll: string;

  @ApiProperty()
  @IsString()
  @IsValidRatingField()
  subjectMastry: string;

  @ApiProperty()
  @IsString()
  @IsValidRatingField()
  classRoomManagement: string;

  @ApiProperty()
  @IsString()
  @IsValidRatingField()
  teachingCoherence: string;

  @ApiProperty()
  @IsString()
  @IsValidRatingField()
  grading: string;

  @ApiProperty()
  @IsString()
  @IsString()
  description: string;
}
