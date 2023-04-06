import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class addDto {
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'name must be numbers only ',
  })
  number: string;

  @IsNotEmpty()
  @ApiProperty()
  extendDate: string;
}
