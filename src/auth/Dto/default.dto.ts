import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isNotEmpty, isNumber } from 'class-validator';

export class DefaultDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  number: string;
}
