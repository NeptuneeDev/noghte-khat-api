import { Subject } from '../../subject/interfaces/subject.interface';

export interface Professor {
  id: number;

  name: string;

  email: string;

  university: string;
  isVerified : boolean
  subject?: Subject[];

  createdAt: Date;

  updatedAt: Date;
}
