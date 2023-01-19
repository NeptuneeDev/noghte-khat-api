import { Injectable } from '@nestjs/common';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: userRepository) {}

  async create(user) {
    this.userRepository.upsert(user);
  }

  async findAll() {
    this.userRepository.findAll();
  }

  async findOne(id: number) {
    this.userRepository.findUnique(id);
  }
  async findByEmail(email: string) {
    return true;
  }
}
