import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class FileService {

    async sayHi(){
        return new Promise((res,rej)=> resolve("sadssa"))
    }
}
