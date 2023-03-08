import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class extendDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsDate()
  extendDate: Date;
}
