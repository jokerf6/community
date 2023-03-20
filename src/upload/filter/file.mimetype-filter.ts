import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    console.log(file);
    callback(null, true);
  };
}
