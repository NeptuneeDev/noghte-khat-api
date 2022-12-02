import { Injectable } from '@nestjs/common';
import prisma from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class userRepository{

    constructor(private readonly prisma:PrismaService){}

    async create(){}
}