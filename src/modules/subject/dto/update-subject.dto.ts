import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-update.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
