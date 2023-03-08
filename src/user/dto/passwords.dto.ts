import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class passwordsDto {
  @IsNotEmpty()
  @ApiProperty()
  userPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  rootPassword: string;
}
