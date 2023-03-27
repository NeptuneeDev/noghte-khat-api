import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsDecimal,
  Validate,
  MaxLength,
} from 'class-validator';
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
  teachingCoherence: Prisma.Decimal;

  @IsValidRatingField()
  grading: string;

  @IsString()
  description: string;
}
