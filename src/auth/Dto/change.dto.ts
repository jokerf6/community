import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class changeDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  number: string;

  @IsNotEmpty()
  @ApiProperty()
  defaultPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
