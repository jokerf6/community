import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ResponseController } from 'src/static/response';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    console.log('hello');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    console.log(ROLES_KEY);
    console.log(requiredRoles);
    if (!requiredRoles) {
      throw new Error(
        "RolesGuard can't be used without @Roles() decorator initiated with roles",
      );
    }
    if (!requiredRoles.some((role) => req.user.userObject?.role === role)) {
      return false;
    }
    return true;
  }
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  if (roles.length === 0) throw new Error('Roles cannot be empty');
  return SetMetadata(ROLES_KEY, roles);
};
