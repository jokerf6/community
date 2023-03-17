import { Controller, Post, Get, Req, Res, Body, Param } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from './prisma.services';
import { ChatService } from './chat/chat.service';

@WebSocketGateway(7400, { cors: '*' })
export class chatGetway {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chat: ChatService,
  ) {}
  @WebSocketServer()
  server;
  @SubscribeMessage('send_message')
  async handleMessage(@Req() req, @Res() res, @MessageBody() message: string) {
    const mess = !message['replay']
      ? await this.chat.addMessage(message['message'])
      : await this.chat.addReplayMessage(
          message['message'],
          message['replayId'],
        );

    message['messageId'] = mess.id;
    await this.chat.addUserMessages(message['id'], res, mess.id);
    await this.server.emit('receive_message', message);
  }

  @SubscribeMessage('unreadReq')
  async handleunread(@MessageBody() message: string) {
    console.log(`running`);
    console.log(message);
    const unReadNumber = await this.prisma.user.findUnique({
      where: {
        id: message['resId'],
      },
      select: {
        unreadMessages: true,
      },
    });
    message['unReadNumber'] = unReadNumber.unreadMessages;
    if (unReadNumber.unreadMessages > 0) {
      const unreadMessageId = await this.prisma.userMessages.findFirst({
        where: {
          messagesId: message['messageId'],
          userId: message['resId'],
        },
        orderBy: { createdAt: 'desc' },
      });
      message['unReadNumberId'] = unreadMessageId.messagesId;
    }
    this.server.emit('unreadRes', message);
  }

  @SubscribeMessage('join')
  async connect(@MessageBody() userId: string) {
    await this.prisma.user.update({
      data: {
        online: true,
        unreadMessages: 0,
      },
      where: {
        id: userId,
      },
    });
    await this.prisma.userMessages.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
  @SubscribeMessage('logout')
  async disConnect(@MessageBody() userId: string) {
    await this.prisma.user.update({
      data: {
        online: false,
      },
      where: {
        id: userId,
      },
    });
  }
}
