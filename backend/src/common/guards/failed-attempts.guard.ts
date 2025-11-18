import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../logger/logger.service';

interface FailedAttempt {
  count: number;
  firstAttempt: Date;
  lastAttempt: Date;
  blockedUntil?: Date;
}

@Injectable()
export class FailedAttemptsGuard implements CanActivate {
  private failedAttempts = new Map<string, FailedAttempt>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos
  private readonly ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

  constructor(private readonly logger: CustomLoggerService) {
    // Limpiar intentos fallidos antiguos cada 10 minutos
    setInterval(() => this.cleanupOldAttempts(), 10 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request);

    const attempt = this.failedAttempts.get(identifier);

    if (attempt?.blockedUntil) {
      const now = new Date();
      if (now < attempt.blockedUntil) {
        const remainingMinutes = Math.ceil((attempt.blockedUntil.getTime() - now.getTime()) / 60000);

        this.logger.security('Blocked login attempt', {
          identifier,
          remainingMinutes,
          severity: 'high',
        });

        throw new HttpException(
          {
            message: `Demasiados intentos fallidos. Cuenta bloqueada temporalmente. Intenta nuevamente en ${remainingMinutes} minuto(s).`,
            blockedUntil: attempt.blockedUntil,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        // El bloqueo expiró, eliminar
        this.failedAttempts.delete(identifier);
      }
    }

    return true;
  }

  recordFailedAttempt(identifier: string) {
    const now = new Date();
    const existing = this.failedAttempts.get(identifier);

    if (!existing) {
      this.failedAttempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return;
    }

    // Si el primer intento fue hace más de ATTEMPT_WINDOW_MS, resetear
    if (now.getTime() - existing.firstAttempt.getTime() > this.ATTEMPT_WINDOW_MS) {
      this.failedAttempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return;
    }

    // Incrementar contador
    existing.count++;
    existing.lastAttempt = now;

    if (existing.count >= this.MAX_ATTEMPTS) {
      existing.blockedUntil = new Date(now.getTime() + this.BLOCK_DURATION_MS);

      this.logger.security('Account temporarily blocked', {
        identifier,
        attempts: existing.count,
        blockedUntil: existing.blockedUntil,
        severity: 'critical',
      });
    } else {
      this.logger.security('Failed login attempt', {
        identifier,
        attempts: existing.count,
        remainingAttempts: this.MAX_ATTEMPTS - existing.count,
        severity: 'medium',
      });
    }

    this.failedAttempts.set(identifier, existing);
  }

  recordSuccessfulAttempt(identifier: string) {
    this.failedAttempts.delete(identifier);
  }

  private getIdentifier(request: any): string {
    const email = request.body?.email;
    const ip = request.ip || request.connection.remoteAddress;
    return email || ip;
  }

  private cleanupOldAttempts() {
    const now = new Date();
    const entriesToDelete: string[] = [];

    this.failedAttempts.forEach((attempt, key) => {
      // Eliminar si el bloqueo expiró hace más de 1 hora
      if (attempt.blockedUntil && now.getTime() - attempt.blockedUntil.getTime() > 60 * 60 * 1000) {
        entriesToDelete.push(key);
      }
      // Eliminar si el último intento fue hace más de 1 hora
      else if (now.getTime() - attempt.lastAttempt.getTime() > 60 * 60 * 1000) {
        entriesToDelete.push(key);
      }
    });

    entriesToDelete.forEach(key => this.failedAttempts.delete(key));

    if (entriesToDelete.length > 0) {
      this.logger.debug(`Cleaned up ${entriesToDelete.length} old failed attempt records`);
    }
  }
}
