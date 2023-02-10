import { ApiProperty } from '@nestjs/swagger';

export class Success {
  @ApiProperty()
  success: boolean;
}
