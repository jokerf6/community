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
        id: req.user.userObject.id,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user donot exist',
        'user donot exist',
      );
    }
    if (userExist.active) {
      const messages = await this.prisma.messages.findMany({
        include: {
          user: true,
          replay: {
            include: {
              messages: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        skip: +query.skip || 0,
        take: +query.take || 15,
        orderBy: { createdAt: 'desc' },
      });
      const numberOfMessages = await this.prisma.messages.count();
      const AllMessage = [];
      const unreadMessageId = await this.prisma.userMessages.findFirst({
        where: {
          userId: req.user.userObject.id,
        },
        orderBy: { createdAt: 'asc' },
      });
      for (let i = 0; i < messages.length; i++) {
        let hours = new Date(messages[i].createdAt);
        //  const Time = hours;

        AllMessage.push({
          id: req.user.userObject.id,
          author: messages[i].user.number,
          message: messages[i].messageBody,
          type: messages[i].type,
          messageId: messages[i].id,

          mediaUrl: messages[i].mediaUrl,
          repType:
            messages[i].replay.length > 0
              ? messages[i].replay[0].replayType
              : null,
          time: hours.getHours() + ':' + hours.getMinutes(),
          replay: messages[i].replay.length > 0 ? true : false,
          replayId:
            messages[i].replay.length > 0
              ? messages[i].replay[0].replayId
              : null,
          userRep:
            messages[i].replay.length > 0
              ? messages[i].replay[0].messages.user.id
              : null,
          repBody:
            messages[i].replay.length > 0
              ? messages[i].replay[0].messages.messageBody
              : null,
          unReadNumber: userExist.unreadMessages,
          unReadNumberId:
            userExist.unreadMessages > 0 ? unreadMessageId.messagesId : null,

          //  "userRep":
        });
      }
      AllMessage.reverse();
      return ResponseController.success(res, 'Get data Successfully', {
        AllMessage,
        numberOfMessages,
      });
    } else {
      const unreadMessageId = await this.prisma.userMessages.findFirst({
        where: {
          userId: req.user.userObject.id,
        },
        orderBy: { createdAt: 'asc' },
      });
      const messages = await this.prisma.messages.findMany({
        where: {
          createdAt: {
            lte: userExist.extend,
          },
        },
        include: {
          user: true,
          replay: {
            include: {
              messages: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        skip: (parseInt(query.skip) - 1) * parseInt(query.take || 15) || 0,
        take: +query.take || 15,
        orderBy: { createdAt: 'desc' },
      });
      const AllMessage = [];

      for (let i = 0; i < messages.length; i++) {
        let hours = new Date(messages[i].createdAt);

        AllMessage.push({
          id: req.user.userObject.id,
          author: messages[i].user.number,
          message: messages[i].messageBody,
          messageId: messages[i].id,
          type: messages[i].type,
          mediaUrl: messages[i].mediaUrl,
          repType:
            messages[i].replay.length > 0
              ? messages[i].replay[0].replayType
              : null,
          time: hours.getHours() + ':' + hours.getMinutes(),

          replay: messages[i].replay.length > 0 ? true : false,
          replayId:
            messages[i].replay.length > 0
              ? messages[i].replay[0].replayId
              : null,
          userRep:
            messages[i].replay.length > 0
              ? messages[i].replay[0].messages.user.id
              : null,
          repBody:
            messages[i].replay.length > 0
              ? messages[i].replay[0].messages.messageBody
              : null,
          unReadNumber: userExist.unreadMessages,
          unReadNumberId:
            userExist.unreadMessages > 0 ? unreadMessageId.messagesId : null,
          //  "userRep":
        });
      }
      AllMessage.reverse();

      return ResponseController.success(
        res,
        'Get data Successfully',
        AllMessage,
      );
    }
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
  async addMessage(body: any, type, mediaUrl, userId) {
    const mess = await this.prisma.messages.create({
      data: {
        type: type,
        messageBody: body,
        mediaUrl: mediaUrl,
        userId: userId,
      },
    });
    return mess;
  }

  async addReplayMessage(body, replayId, type, mediaUrl, repType, userId) {
    const mess = await this.prisma.messages.create({
      data: {
        type: type,
        messageBody: body,
        mediaUrl: mediaUrl,
        userId: userId,
      },
    });
    await this.prisma.replay.create({
      data: {
        messagesId: replayId,
        replayId: mess.id,
        replayType: repType,
      },
    });

    return mess;
  }
}
