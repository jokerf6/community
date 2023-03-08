import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class addUser {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  number: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDate()
  extendDate: Date;
}
