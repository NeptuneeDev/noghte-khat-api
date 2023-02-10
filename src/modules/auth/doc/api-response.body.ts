// import { ApiResponseOptions,ApiResponse } from "@nestjs/swagger";

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { stringify } from 'querystring';
import { UserLoginDto } from '../Dto/user-login.Dto';
import { LoginSuccess } from '../types/login.success.type';
import { Success } from '../types/success.return.type';

// export function ApiResponses(){

//     return async function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;

//   @ApiResponse({ status: 200, description: 'Successful Login' })
//   @ApiResponse({ status: 400, description: 'Bad Request' })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
// }

export const ApiSendCodeDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'regestred successfuly',
      type: Success,
    }),

    ApiBadRequestResponse({ description: 'too much request for otp...' }),
  );
};

export const ApiLoginDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'loggedIn successfuly',
      type: LoginSuccess,
      schema: {
        example: UserLoginDto,
      },
    }),
    ApiBadRequestResponse({
      description: "credintals aren't correct...",
    }),
  );
};
