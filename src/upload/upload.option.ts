import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const storage = (folder = '') => {
  return {
    storage: diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, cb) => {
        const filename: string =
          path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      },
    }),
  };
};
