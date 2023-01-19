export interface User {
  id: number;
  name: string;
  email: string;
  hashedRT?: string;
  password: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}
