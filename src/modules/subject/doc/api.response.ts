import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Success } from 'src/modules/auth/doc/types/success.return.type';

export const ApiDeleteSubjectDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'delete successfuly',
      type: Success,
    }),

    ApiBadRequestResponse({ description: 'not found subject' }),
    ApiBearerAuth(),
  );
};

export const ApiUpdateSubjectDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'updated successfuly',
      type: Success,
    }),

    ApiBadRequestResponse({ description: 'not found subject' }),
    ApiBearerAuth(),
  );
};
