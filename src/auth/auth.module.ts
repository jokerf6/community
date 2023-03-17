import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.services';
import { tokenService } from './token.services';
import { jwtStrategy } from './stratiges/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, tokenService, jwtStrategy],
})
export class AuthModule {}
