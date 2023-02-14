import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Success } from 'src/modules/auth/doc/types/success.return.type';
import { UploadedFileDto } from '../Dto/upload.file.Dto';

export const ApiUploadFileDoc = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'uploaded successfuly',
      type: Success,
    }),

    ApiBadRequestResponse({ description: 'subject id not valid!' }),
    ApiBearerAuth(),
  );
};

export const ApiDeleteFileDoc = () => {
  return applyDecorators(
    ApiOkResponse({ description: 'deleted successfuly', type: Success }),
    ApiBadRequestResponse({ description: 'there is no file with this name.' }),
    ApiBearerAuth(),
  );
};
