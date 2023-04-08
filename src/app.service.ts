import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { ResponseController } from './util/response.controller';
import { messageType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import path, { join } from 'path';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async changeDefault(res, passwordsDto) {
    const { userPassword, rootPassword } = passwordsDto;
    const idpass = await this.prisma.defaultPasswords.findMany({
      select: { id: true },
    });
    const hashPassword = await bcrypt.hash(userPassword, 8);
    const hashPassword2 = await bcrypt.hash(rootPassword, 8);
    await this.prisma.defaultPasswords.update({
      where: {
        id: idpass[0].id,
      },
      data: {
        notHashingRootPassword: rootPassword,
        notHashingUserPassword: userPassword,
        userPassword: hashPassword,
        rootPassword: hashPassword2,
      },
    });
    return ResponseController.success(res, 'Data changed Successfully', null);
  }
  async getMedia(res, query) {
    const media = await this.prisma.messages.findMany({
      skip: +query.skip || 0,
      take: +query.take || 15,
      where: {
        OR: [
          {
            type: messageType.PNG,
          },
          {
            type: messageType.JPEG,
          },
          {
            type: messageType.JPG,
          },
          {
            type: messageType.MP4,
          },
        ],
      },
      select: {
        messageBody: true,
        mediaUrl: true,
      },
    });
    const allMedia = await this.prisma.messages.count({
      where: {
        OR: [
          {
            type: messageType.PNG,
          },
          {
            type: messageType.JPEG,
          },
          {
            type: messageType.JPG,
          },
          {
            type: messageType.MP4,
          },
        ],
      },
    });
    return ResponseController.success(res, 'Get users Successfully', {
      media,
      allMedia,
    });
  }
  async sendFile(res, id) {
    console.log(id.split('uploads/')[0]);
    console.log(__dirname);
    const filePath = join(
      __dirname,
      '..',
      `/uploads/${id.split('uploads/')[0]}`,
    );

    res.sendFile(filePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Sent:', 'fileName');
      }
    });
  }
  async getchangeDefault(res) {
    const passwords = await this.prisma.defaultPasswords.findMany({
      select: {
        notHashingRootPassword: true,
        notHashingUserPassword: true,
      },
    });

    const password = {
      userPassord: passwords[0].notHashingUserPassword,
      rootPassord: passwords[0].notHashingRootPassword,
    };
    return ResponseController.success(
      res,
      'Get passord Successfully',
      password,
    );
  }
  async downloadFile(res, id) {
    console.log(id.split('uploads/')[0]);
    console.log(__dirname);
    const filePath = join(
      __dirname,
      '..',
      `/uploads/${id.split('uploads/')[0]}`,
    );

    res.download(filePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Sent:', 'fileName');
      }
    });
  }
}
