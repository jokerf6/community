import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class chatData {
  @IsNotEmpty()
  @ApiProperty()
  body: string;
}
