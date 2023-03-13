import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { ResponseController } from 'src/util/response.controller';
import * as bcrypt from 'bcrypt';
import { tokenService } from './token.services';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenServices: tokenService,
  ) {}
  async signin(res, loginDto) {
    const { number, password } = loginDto;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'User Donot exist',
        'User Donot exist',
      );
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        'incorrect Password',
        'incorrect Password',
      );
    }
    console.log(password, password.length);

    await this.prisma.token.deleteMany({
      where: {
        userId: userExist.id,
      },
    });
    const accessToken = await this.tokenServices.createAccess(userExist);
    return ResponseController.success(res, 'Login successfully', {
      userExist,
      accessToken,
    });
  }
  async reset(res, loginDto) {
    const { number, password } = loginDto;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'User Donot exist',
        'User Donot exist',
      );
    }
    const defPasswords = await this.prisma.defaultPasswords.findMany({});
    const validPassword =
      userExist.role == 'ADMIN'
        ? await bcrypt.compare(password, defPasswords[0].rootPassword)
        : await bcrypt.compare(password, defPasswords[0].userPassword);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        'incorrect Password',
        'incorrect Password',
      );
    }

    await this.prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        password:
          userExist.role == 'ADMIN'
            ? defPasswords[0].rootPassword
            : defPasswords[0].userPassword,
      },
    });
    return ResponseController.success(res, 'Password back to default', null);
  }
  async generate(res, loginDto) {
    const { number, password } = loginDto;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'User Donot exist',
        'User Donot exist',
      );
    }
    const hashPassword = await bcrypt.hash(password, 8);

    await this.prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        password: hashPassword,
      },
    });
    return ResponseController.success(
      res,
      'Password change Successfully',
      null,
    );
  }
  async change(res, loginDto) {
    const { number, defaultPassword, password } = loginDto;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'User Donot exist',
        'User Donot exist',
      );
    }
    const defPasswords = await this.prisma.defaultPasswords.findMany({});

    const validPassword =
      userExist.role == 'ADMIN'
        ? await bcrypt.compare(defaultPassword, defPasswords[0].rootPassword)
        : await bcrypt.compare(defaultPassword, defPasswords[0].userPassword);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        'incorrect Password',
        'incorrect Password',
      );
    }
    const hashPassword = await bcrypt.hash(password, 8);
    console.log(password);
    console.log(userExist.id);
    await this.prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        password: hashPassword,
      },
    });
    return ResponseController.success(
      res,
      'Password change Successfully',
      null,
    );
  }
  async default(res, defaultDto) {
    const { number } = defaultDto;
    const userExist = await this.prisma.user.findFirst({
      where: {
        number,
      },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        'User Donot exist',
        'User Donot exist',
      );
    }
    if (userExist.role === Role.ADMIN) {
      return ResponseController.forbidden(
        res,
        'Admin cannot git default password',
      );
    }
    const defPasswords = await this.prisma.defaultPasswords.findMany({});
    return ResponseController.success(
      res,
      'Get default password Successfully',
      {
        password: defPasswords[0].notHashingUserPassword,
      },
    );
  }
  async changer(res) {
    const hashPassword1 = await bcrypt.hash('123', 8);
    const hashPassword2 = await bcrypt.hash('124', 8);
    await this.prisma.defaultPasswords.create({
      data: {
        notHashingUserPassword: '123',
        notHashingRootPassword: '124',
        userPassword: hashPassword1,
        rootPassword: hashPassword2,
      },
    });
    return ResponseController.success(res, 'Success', null);
  }
}
