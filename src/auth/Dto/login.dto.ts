import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  number: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
