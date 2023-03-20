import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";

import { fileMimetypeFilter } from "../filter/file.mimetype-filter";
import { storage } from "../upload.option";

export function ApiFile(
  fieldName = "file",
  required = false,
  localOptions?: MulterOptions,
  folder?
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, { ...storage(folder), ...localOptions })
    ),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: "string",
            format: "binary",
          },
        },
      },
    })
  );
}

export function ApiAssetFile(fileName = "image", required = false, folder?) {
  return ApiFile(
    fileName,
    required,
    {
      fileFilter: fileMimetypeFilter("pdf"),
    },
    folder
  );
}

export function ApiPdfFile(fileName = "document", required = false, folder?) {
  return ApiFile(
    fileName,
    required,
    {
      fileFilter: fileMimetypeFilter("pdf"),
    },
    folder
  );
}
