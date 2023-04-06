import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  ValidationPipe,
  Delete,
} from '@nestjs/common';

import { Response } from 'express';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { addUser } from './dto/addUser.dto';
import { extendDto } from './dto/extendDto.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('Access Token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/add')
  addUser(@Res() res: Response, @Body(ValidationPipe) addUser: addUser) {
    return this.userService.addUser(res, addUser);
  }
  @ApiQuery({
    name: 'skip',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    type: String,
    required: false,
  })
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all')
  all(
    @Res() res: Response,
    @Query()
    query: {
      skip?: string;
      take?: string;
    },
  ) {
    return this.userService.all(res, query);
  }

  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/pending')
  pending(@Res() res: Response) {
    return this.userService.pending(res);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/acceptAll')
  acceptAll(@Res() res: Response) {
    return this.userService.acceptAll(res);
  }

  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/removeAll')
  removeAll(@Res() res: Response) {
    return this.userService.removeAll(res);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id/remove')
  userRemove(@Res() res: Response, @Param('id') id: string) {
    return this.userService.remove(res, id);
  }

  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id/accept')
  useraccept(@Res() res: Response, @Param('id') id: string) {
    return this.userService.accept(res, id);
  }

  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id/extendDate')
  extend(
    @Res() res: Response,
    @Body() extendDto: extendDto,
    @Param('id') id: string,
  ) {
    return this.userService.extend(res, id, extendDto);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:id/endSession')
  endSession(@Res() res: Response, @Param('id') id: string) {
    return this.userService.endSession(res, id);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:id/changeRole')
  makeAdmin(@Res() res: Response, @Param('id') id: string) {
    return this.userService.makeAdmin(res, id);
  }
}
