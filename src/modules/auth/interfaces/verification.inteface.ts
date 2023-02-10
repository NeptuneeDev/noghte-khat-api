import { ApiProperty } from '@nestjs/swagger';

export interface Verificaition {
  id?: number;

  email: string;

  try?: number;
  code: string;

  lastResendTime?: Date;
}
