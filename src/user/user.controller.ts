import { Controller, Post, Get, Req, Res, Body, Param } from '@nestjs/common';

import { Response } from 'express';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { addUser } from './dto/addUser.dto';
import { extendDto } from './dto/extendDto.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/add')
  addUser(@Res() res: Response, @Body() addUser: addUser) {
    return this.userService.addUser(res, addUser);
  }
  @Get('/all')
  all(@Res() res: Response) {
    return this.userService.all(res);
  }
  @Post('/:id/extend')
  extend(
    @Res() res: Response,
    @Body() extendDto: extendDto,
    @Param('id') id: string,
  ) {
    return this.userService.extend(res, id, extendDto);
  }

  @Get('/:id/extendSession')
  endSession(@Res() res: Response, @Param('id') id: string) {
    return this.userService.endSession(res, id);
  }
  @Get('/:id/makeAdmin')
  makeAdmin(@Res() res: Response, @Param('id') id: string) {
    return this.userService.makeAdmin(res, id);
  }
}
