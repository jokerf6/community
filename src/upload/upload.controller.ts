import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Observable, max, of } from 'rxjs';
import { ApiAssetFile } from './decorator/api-file.decorator';
import { ParseFile } from './pipes/parse-file.pip';
import { AuthGuard } from '@nestjs/passport';

//
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  // @ApiBearerAuth("Access Token")
  // @UseGuards(AuthGuard("jwt"))
  @Post('file')
  @ApiAssetFile('file', true)
  uploadFile(@UploadedFile(ParseFile) file): Observable<{ url: string }> {
    console.log(__dirname);
    return of({
      url: `${process.env.BASE_URL}/api/v1/uploads/${file.path
        .replace('uploads\\', '')
        .replace('\\', '/')}`,
    });
  }
}

//// Extract text from pdf in nestjs?
