import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.services';
import { jwtStrategy } from 'src/auth/stratiges/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, jwtStrategy],
})
export class UserModule {}
