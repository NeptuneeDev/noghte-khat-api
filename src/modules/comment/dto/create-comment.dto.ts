import { IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { IsValidRatingField, RatingValidator } from './custom.validator';
export class CreateCommentDto {
  @IsString()
  subjectName: string;

  @IsString()
  presenceRoll: string;

  @IsValidRatingField()
  subjectMastry: string;

  @IsValidRatingField()
  classRoomManagement: string;

  @IsValidRatingField()
  teachingCoherence: string;

  @IsValidRatingField()
  grading: string;

  @IsString()
  description: string;
}
