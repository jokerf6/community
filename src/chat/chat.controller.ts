import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Query,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { changeDto } from 'src/auth/Dto/change.dto';
import { chatData } from './dto/chatData.dto';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
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
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getMessages(
    @Req() req: Request,
    @Res() res: Response,
    @Query()
    query: {
      skip?: string;
      take?: string;
    },
  ) {
    return this.chatService.getMessages(req, res, query);
  }
}
