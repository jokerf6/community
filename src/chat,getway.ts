import { Controller, Post, Get, Req, Res, Body, Param } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { PrismaService } from './prisma.services';
import { ChatService } from './chat/chat.service';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { messageType } from '@prisma/client';

@WebSocketGateway({ cors: '*' })
export class chatGetway implements OnGatewayConnection, OnGatewayInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chat: ChatService,
  ) {}
  private readonly clients = new Map<string, any>();

  private logger: Logger = new Logger('AppGateWay');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }
  handleConnection(client) {
    //e.log('Client connected: ' + client.id);
  }

  async handleDisconnect(client) {
    const userId = [...this.clients.entries()]
      .filter(({ 1: c }) => c === client.id)
      .map(([k]) => k)[0];
    this.clients.delete(userId);
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
    console.log('Client disconnected: ' + client.id + ' ', userId);
    if (userId) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          online: false,
        },
      });
    }
  }

  @SubscribeMessage('userOnline')
  async handleUserOnline(client, data) {
    this.clients.set(data, client.id);
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

    console.log(client.id, data);
    if (data) {
      await this.prisma.user.update({
        data: {
          online: true,
          unreadMessages: 0,
        },
        where: {
          id: data,
        },
      });
      await this.prisma.userMessages.deleteMany({
        where: {
          userId: data,
        },
      });
    }
    //  //e.log('User ' + data + ' is online');
    // update user status in data store
  }

  @SubscribeMessage('userOffline')
  async handleUserOffline(client, data) {
    //e.log('User ' + data + ' is offline');
    // update user status in data store
  }
  @WebSocketServer()
  server;
  @SubscribeMessage('send_message')
  async handleMessage(@Req() req, @Res() res, @MessageBody() message: string) {
    const valid = await this.prisma.user.findUnique({
      where: {
        id: message['id'],
      },
    });
    if (valid && valid.role === 'ADMIN') {
      const mess = !message['replay']
        ? await this.chat.addMessage(
            message['message'],
            message['type'],
            message['mediaUrl'],
            message['id'],
          )
        : await this.chat.addReplayMessage(
            message['message'],
            message['replayId'],
            message['type'],
            message['mediaUrl'],
            message['repType'],
            message['id'],
          );

      message['messageId'] = mess.id;
      await this.chat.addUserMessages(message['id'], res, mess.id);
      await this.server.emit('receive_message', message);
    }
  }
  @SubscribeMessage('delete')
  async delete(@MessageBody() messageId: string) {
    //e.log('mess ', messageId);
    await this.prisma.messages.update({
      where: {
        id: messageId,
      },
      data: {
        type: messageType.DELETED,
      },
    });
    this.server.emit('message_delete', messageId);
  }
  @SubscribeMessage('unreadReq')
  async handleunread(@MessageBody() message: string) {
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
  async connect(@MessageBody() userId) {
    // //e.log('lllllllllllllllllllllllllllllllllllllllllllllllllllll');

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
    //   //e.log(userId, 'disconnected');

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
