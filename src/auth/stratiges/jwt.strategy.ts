import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { use } from 'passport';

import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jsonWebTokenOptions: {
        maxAge: 100 * 24 * 60 * 60,
      },
    });
  }
  async validate(payload: any, done: any) {
    console.log(payload);
    const jti = await this.prisma.token.findFirst({
      where: {
        id: payload.id,
      },
    });
    //e.log('jkgjhghjghgfghf');
    console.log(jti);

    if (jti) {
      const user = await this.prisma.user.findFirst({
        where: { id: jti.userId },
      });
      if (user) {
        const date = new Date();
        if (!user.active && user.role !== 'ADMIN' && user.extend > date) {
          await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              active: false,
            },
          });
          //   done(null, false);
          user['active'] = false;
        }

        done(null, {
          userObject: { ...user },
          jti: payload.jti,
          refresh: payload.refresh || false,
        });
      } else {
        done(null, false);
      }
    }
    done(null, false);
  }
}
