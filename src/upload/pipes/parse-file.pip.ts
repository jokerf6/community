import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ResponseController } from 'src/static/response';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    console.log(files);
    if (files === undefined || files === null) {
      throw new BadRequestException('Validation failed (file expected)');
    }

    return files;
  }
}
