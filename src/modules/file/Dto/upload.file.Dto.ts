import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UploadedFileDto {
  @IsString()
  @MaxLength(30, { message: "title shouldn't be more than 30 characters" })
  title: string;

  @IsString()
  @MaxLength(255, {
    message: "disciption shouldn't be more than 30 characters",
  })
  description: string;
}
