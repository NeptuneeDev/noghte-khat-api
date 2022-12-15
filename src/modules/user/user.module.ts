import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, userRepository],
  controllers: [UserController],
})
export class UserModule {}
