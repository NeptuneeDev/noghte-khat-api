import { Module } from '@nestjs/common';
import { userRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService,userRepository]
})
export class UserModule {}
