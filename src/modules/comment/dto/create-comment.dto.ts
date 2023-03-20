import { classType } from '@prisma/client';
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
  rollcall: string;

  @IsOptional()
  @IsEnum(classType)
  type: classType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  teaching: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  rhetorical: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  manageClass: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  ability: number;

  @IsOptional()
  @IsDateString()
  semester?: Date;

  @IsString()
  description: string;
}
