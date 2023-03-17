import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { ResponseController } from './util/response.controller';
import { messageType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 15) || 0,
      take: +query.take || 15,
      where: {
        type: messageType.MEDIA,
      },
      select: {
        messageBody: true,
      },
    });
    const allMedia = await this.prisma.messages.count({
      where: {
        type: messageType.MEDIA,
      },
    });
    return ResponseController.success(res, 'Get users Successfully', {
      media,
      allMedia,
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
      userPassord: passwords[0].notHashingRootPassword,
      rootPassord: passwords[0].notHashingRootPassword,
    };
    return ResponseController.success(
      res,
      'Get passord Successfully',
      password,
    );
  }
}
