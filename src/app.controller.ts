import {
  Controller,
  Get,
  Post,
  Patch,
  Res,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { passwordsDto } from './user/dto/passwords.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/changeDefaultPassword')
  changeDefault(@Res() res: Response, @Body() passwordsDto: passwordsDto) {
    return this.appService.changeDefault(res, passwordsDto);
  }
  @ApiBearerAuth('Access Token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/changeDefaultPassword')
  getchangeDefault(@Res() res: Response) {
    return this.appService.getchangeDefault(res);
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
  @Get('/media')
  getMedia(
    @Res() res: Response,
    @Query()
    query: {
      skip?: string;
      take?: string;
    },
  ) {
    return this.appService.getMedia(res, query);
  }
}
