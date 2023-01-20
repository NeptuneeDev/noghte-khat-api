import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pptx|word|pdf|docx|doc)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const disk = {
  storage: diskStorage({
    destination: './upload',
    filename(req, file, callback) {
      const unixSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); //1,000,000,000
      const ext = path.extname(file.originalname);
      const fileName = `${path
        .parse(file.originalname)
        .name.replace(/\s/g, '')}${unixSuffix}${ext}`;

      callback(null, fileName);
    },
  }),
  fileFilter: imageFileFilter,
};
