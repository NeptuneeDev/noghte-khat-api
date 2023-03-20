import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Success } from "../../auth/doc/types/success.return.type"
export const ApiUploadFileDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'uploaded successfuly',
      type: Success,
    }),

    ApiBadRequestResponse({ description: 'subject id not valid!' }),
    ApiResponse({
      description: 'File type not valid!',
      status: HttpStatus.FORBIDDEN,
    }),
    ApiBearerAuth(),
  );
};

export const ApiDeleteFileDoc = () => {
  return applyDecorators(
    ApiOkResponse({ description: 'deleted successfuly', type: Success }),
    ApiBadRequestResponse({ description: 'File Not Found' }),
    ApiBearerAuth(),
  );
};

export const ApiUpdateFileDoc = () => {
  return applyDecorators(
    ApiOkResponse({ description: 'update successfuly', type: Success }),
    ApiBadRequestResponse({ description: 'file Not found' }),
    ApiBearerAuth(),
  );
};
