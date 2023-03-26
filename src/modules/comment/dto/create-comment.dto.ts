import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  subjectName: string;

  @IsString()
  presenceRoll: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  subjectMastry: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  classRoomManagement: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  teachingCoherence: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  grading: number;

  @IsString()
  description: string;
}
