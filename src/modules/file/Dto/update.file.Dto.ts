import { OmitType, PartialType } from '@nestjs/swagger';

import { UploadFileDto } from './upload.file.Dto';
export class UpdateFileDto extends OmitType(UploadFileDto, ['file'] as const) {}
