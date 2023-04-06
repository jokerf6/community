import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { loginDto } from './Dto/login.dto';
import { changeDto } from './Dto/change.dto';
import { DefaultDto } from './Dto/default.dto';
import { Response } from 'express';
import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { addDto } from './Dto/add.dto';

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
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/changeStatus')
  changeStatus(@Req() req: Request, @Res() res: Response) {
    return this.authService.changeStatus(req, res);
  }

  @Post('/signup')
  signup(@Res() res: Response, @Body(ValidationPipe) addDto: addDto) {
    return this.authService.signup(res, addDto);
  }
}
