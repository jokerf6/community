import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.services';
import * as jwt from 'jsonwebtoken';
import { user } from '@prisma/client';

@Injectable()
export class tokenService {
  constructor(private prisma: PrismaService) {}
  async createAccess(user: user) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
      },
    });
    const accessToken = jwt.sign(
      { userId: user.id, id: tokenId.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 100 * 24 * 60 * 60 },
    );
    return accessToken;
  }
}
