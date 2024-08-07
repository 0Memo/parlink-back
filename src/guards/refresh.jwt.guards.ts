/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
constructor(private jwtService: JwtService) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
    throw new UnauthorizedException();
    }
    try {
    const payload = await this.jwtService.verifyAsync(
        token,
        {
            secret: process.env.JWT_REFRESH_TOKEN
        }
    );
    console.log('payload', payload)
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['refresh_token'] = token;
    } catch(error) {
    throw new UnauthorizedException(error);
    }
    return true;
}

private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}