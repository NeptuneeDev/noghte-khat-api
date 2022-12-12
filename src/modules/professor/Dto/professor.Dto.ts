import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfessorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  university: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SearchByNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
