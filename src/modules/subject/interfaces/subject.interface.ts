export interface Subject {
  id: number;
  title: string;
  isVerified: boolean;
  professorId: number;
  createdAt: Date;

  updatedAt: Date;
}
