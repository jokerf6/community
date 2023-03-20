import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  MulterField,
  MulterOptions,
} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import {
  ReferenceObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { storage } from "../upload.option";

export type UploadFields = MulterField & { required?: boolean };

export function ApiFileFields(
  uploadFields: UploadFields[],
  localOptions?: MulterOptions,
  folder?
) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    Object.assign(
      {},
      ...uploadFields.map((field) => {
        return { [field.name]: { type: "string", format: "binary" } };
      })
    );
  const apiBody = ApiBody({
    schema: {
      type: "object",
      properties: bodyProperties,
      required: uploadFields.filter((f) => f.required).map((f) => f.name),
    },
  });

  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(uploadFields, {
        ...storage(folder),
        ...localOptions,
      })
    ),
    ApiConsumes("multipart/form-data"),
    apiBody
  );
}
