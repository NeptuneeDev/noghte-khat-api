import { IsString } from 'class-validator';

export class deleteObject {
  @IsString()
  key: string;
}
