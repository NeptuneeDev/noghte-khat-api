import { ApiProperty } from '@nestjs/swagger';

export class InValidJwtResponse {
  @ApiProperty()
  message: string;
}
