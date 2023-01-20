import { File } from 'src/modules/file/interfaces/file.interface';
import { Subject } from '../../subject/interfaces/subject.interface';

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
