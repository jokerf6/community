import { Injectable } from '@nestjs/common';
import { messageType } from '@prisma/client';
import { PrismaService } from 'src/prisma.services';
import { ResponseController } from 'src/util/response.controller';
import { chatData } from './dto/chatData.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async getMessages(req, res, query) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: req.userObject.user.id,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user donot exist',
        'user donot exist',
      );
    }
    const messages = await this.prisma.messages.findMany({
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 15) || 0,
      take: +query.take || 15,
      orderBy: { createdAt: 'asc' },
    });

    return ResponseController.success(res, 'Get data Successfully', messages);
  }
  async addUserMessages(user: any, res: any, body: any) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: user,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user donot exist',
        'user donot exist',
      );
    }
    const users = await this.prisma.user.findMany({
      where: {
        active: true,
        online: false,
      },
      select: {
        id: true,
        online: true,
        unreadMessages: true,
      },
    });
    for (let i = 0; i < users.length; i += 1) {
      if (userExist.id !== users[i].id) {
        await this.prisma.userMessages.create({
          data: {
            userId: users[i].id,
            read: false,
            messagesId: body,
          },
        });
        await this.prisma.user.update({
          where: {
            id: users[i].id,
          },
          data: {
            unreadMessages: users[i].unreadMessages + 1,
          },
        });
      }
    }

    // return ResponseController.success(res, 'add data Successfully', null);
  }
  async addMessage(body: any, type, mediaUrl) {
    console.log(body);
    const mess = await this.prisma.messages.create({
      data: {
        type: type,
        messageBody: body,
        mediaUrl: mediaUrl,
      },
    });
    return mess;
  }

  async addReplayMessage(body, replayId, type, mediaUrl) {
    const mess = await this.prisma.messages.create({
      data: {
        type: type,
        messageBody: body,
        replayId: replayId,
        mediaUrl: mediaUrl,
      },
    });
    return mess;
  }
}
