import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-lesson.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
