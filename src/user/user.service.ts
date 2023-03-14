import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.services';
import { ResponseController } from 'src/util/response.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async addUser(res, addUser) {
    const { number, extendDate } = addUser;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (userExist) {
      return ResponseController.conflict(res, 'user already exist');
    }
    if (extendDate < Date.now()) {
      return ResponseController.badRequest(
        res,
        'date cannot be less than now',
        'date cannot be less than now',
      );
    }
    const passwords = await this.prisma.defaultPasswords.findMany({});
    console.log(passwords);
    console.log(number);
    const hashPassword = await bcrypt.hash(
      passwords[0].notHashingUserPassword,
      8,
    );
    await this.prisma.user.create({
      data: {
        number,
        password: hashPassword,
        role: Role.USER,
        extend: extendDate,
        online: false,
      },
    });

    return ResponseController.success(res, 'User Create Successfully');
  }

  async extend(res, id, extendDto) {
    const { extendDate } = extendDto;
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user not exist',
        'user not exist',
      );
    }
    const date = new Date();

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        extend: extendDate,
        active: extendDate < date ? false : true,
      },
    });
    return ResponseController.success(res, 'user extended Successfully', null);
  }
  async endSession(res, id) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user not exist',
        'user not exist',
      );
    }
    const date = new Date();
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: false,
        extend: date,
      },
    });
  }
  async all(res) {
    const users = await this.prisma.user.findMany({});
    return ResponseController.success(res, 'Get users Successfully', users);
  }

  async makeAdmin(res, id) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'user not exist',
        'user not exist',
      );
    }
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        role: Role.ADMIN,
      },
    });
    await this.prisma.token.delete({
      where: {
        userId: id,
      },
    });
    return ResponseController.success(
      res,
      'user became admin successfully',
      null,
    );
  }
}
