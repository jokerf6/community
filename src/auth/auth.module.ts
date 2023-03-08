import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.services';
import { tokenService } from './token.services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, tokenService],
})
export class AuthModule {}
