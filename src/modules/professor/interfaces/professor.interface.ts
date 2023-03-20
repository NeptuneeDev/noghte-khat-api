import { Subject } from '@prisma/client';
import { File } from '@prisma/client';

export interface Professor {
  id: number;

  name: string;

  email: string;

  university: string;
  isVerified: boolean;
  subjectss?: Subject[];
  files?: File[];

  createdAt: Date;

  updatedAt: Date;
}
