export interface Verificaiton {
  id?: number;

  email: string;

  try?: number;
  code: string;
  lastResendTime?: Date;
}
