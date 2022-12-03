import { Injectable } from '@nestjs/common';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(private readonly userRepository:userRepository){}
}
