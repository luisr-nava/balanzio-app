import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { isValidUUID } from '../utils/security.util';

/**
 * Guard que valida que los parámetros UUID sean válidos
 * Previene inyecciones y errores de base de datos
 */
@Injectable()
export class UuidValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    if (!params || typeof params !== 'object') {
      return true;
    }

    // Validar todos los parámetros que terminen en 'Id' o sean 'id'
    for (const [key, value] of Object.entries(params)) {
      if ((key.endsWith('Id') || key === 'id') && typeof value === 'string') {
        if (!isValidUUID(value)) {
          throw new BadRequestException(`El parámetro '${key}' debe ser un UUID válido`);
        }
      }
    }

    return true;
  }
}
