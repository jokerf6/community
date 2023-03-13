import { Controller, Get, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { loginDto } from './Dto/login.dto';
import { changeDto } from './Dto/change.dto';
import { DefaultDto } from './Dto/default.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signin(@Res() res: Response, @Body() loginDto: loginDto) {
    return this.authService.signin(res, loginDto);
  }
  @Post('/resetPassword')
  reset(@Res() res: Response, @Body() loginDto: loginDto) {
    return this.authService.reset(res, loginDto);
  }
  @Post('/generatePassword')
  generatePassword(@Res() res: Response, @Body() loginDto: loginDto) {
    return this.authService.generate(res, loginDto);
  }
  @Post('/changePassword')
  changePassword(@Res() res: Response, @Body() changeDto: changeDto) {
    return this.authService.change(res, changeDto);
  }
  @Post('/defaultPassword')
  defaultPassword(@Res() res: Response, @Body() defaultDto: DefaultDto) {
    return this.authService.default(res, defaultDto);
  }

  @Get('changeop')
  changer(@Res() res: Response) {
    return this.authService.changer(res);
  }
}
