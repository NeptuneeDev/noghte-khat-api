import { Subject } from '../../subject/interfaces/subject.interface';
import { File } from '@prisma/client';

export interface Professor {
  id: number;

  name: string;

  email: string;

  university: string;
  isVerified: boolean;
  subject?: Subject[];
  file?: File[];
  createdAt: Date;

  updatedAt: Date;
}
