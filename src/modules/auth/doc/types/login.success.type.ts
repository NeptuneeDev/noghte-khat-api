import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccess {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
}
