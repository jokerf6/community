import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  Matches,
  isNotEmpty,
} from 'class-validator';

export class addUser {
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'name must be numbers only ',
  })
  number: string;

  @IsNotEmpty()
  @ApiProperty()
  extendDate: Date;
}
