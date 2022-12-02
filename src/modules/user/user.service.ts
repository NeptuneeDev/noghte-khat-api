import { Injectable } from '@nestjs/common';
import { UserSignInDto } from './Dto/user-signin.dto';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(private readonly userRepository:userRepository){}

    async signin(user:UserSignInDto){
        
        // check if it exists varificaiton table for it
       
    const varificaiton= await this.userRepository.findVarification(user.email)

    if(varificaiton&&this.isRequestedAlot(varificaiton.try,varificaiton.lastResendTime))
    { // return error  
    }

      
    

    }











    isRequestedAlot(numberOfTry: number,lastResendTime:Date):boolean{ 
         
        if(numberOfTry >30 && new Date(lastResendTime).getTime()< new Date().getTime()+2*7*24*60*60*1000){
            return true
        }
    
        return false;
    }

    generateCode(){
        return 
    }

}
