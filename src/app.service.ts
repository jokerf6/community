import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { ResponseController } from './util/response.controller';

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
    await this.prisma.defaultPasswords.update({
      where: {
        id: idpass[0].id,
      },
      data: {
        userPassword: userPassword,
        rootPassword: rootPassword,
      },
    });
    return ResponseController.success(res, 'Data changed Successfully', null);
  }
}
