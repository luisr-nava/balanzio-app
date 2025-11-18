import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../../config/envs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
      passReqToCallback: true, // Para acceder al token raw
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<JwtPayload> {
    // Extraer el token raw del header
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Verificar si está en la blacklist
    if (token && this.tokenBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    if (!payload.id || !payload.role || !payload.projectId) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    return payload;
  }
}
