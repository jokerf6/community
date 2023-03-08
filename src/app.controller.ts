import { Controller, Get, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { passwordsDto } from './user/dto/passwords.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/changeDefault')
  changeDefault(@Res() res: Response, @Body() passwordsDto: passwordsDto) {
    return this.appService.changeDefault(res, passwordsDto);
  }
}
