import { createHash, timingSafeEqual } from 'crypto';

/**
 * Compara dos strings de forma segura contra timing attacks
 * @param a Primer string
 * @param b Segundo string
 * @returns true si son iguales, false si no
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // Para que timingSafeEqual funcione, ambos buffers deben tener la misma longitud
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  // Si las longitudes son diferentes, crear buffers del mismo tamaño
  if (bufferA.length !== bufferB.length) {
    // Hacer hash de ambos para que tengan la misma longitud
    const hashA = createHash('sha256').update(a).digest();
    const hashB = createHash('sha256').update(b).digest();
    return timingSafeEqual(hashA, hashB);
  }

  try {
    return timingSafeEqual(bufferA, bufferB);
  } catch (error) {
    return false;
  }
}

/**
 * Valida que un string sea un UUID válido v4
 * @param uuid String a validar
 * @returns true si es un UUID válido
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitiza un email removiendo caracteres peligrosos
 * @param email Email a sanitizar
 * @returns Email sanitizado
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remover espacios y convertir a minúsculas
  return email.trim().toLowerCase();
}

/**
 * Valida que un string no contenga caracteres peligrosos para SQL
 * (Prisma ya protege contra SQL injection, pero esto es una capa extra)
 * @param input String a validar
 * @returns true si es seguro
 */
export function isSafeForDatabase(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return true;
  }

  // Detectar patrones sospechosos
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /(UNION\s+SELECT)/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Genera un token aleatorio seguro
 * @param length Longitud del token (default: 32)
 * @returns Token hexadecimal
 */
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Valida la fortaleza de una contraseña
 * @param password Contraseña a validar
 * @returns Objeto con resultado y mensaje
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message: string;
} {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strength < 3) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos 3 de los siguientes: mayúsculas, minúsculas, números, caracteres especiales',
    };
  }

  return { isValid: true, message: 'Contraseña válida' };
}

/**
 * Ofusca información sensible para logs
 * @param data Dato a ofuscar
 * @param visibleChars Caracteres visibles al inicio y final
 * @returns String ofuscado
 */
export function maskSensitiveData(data: string, visibleChars: number = 2): string {
  if (!data || typeof data !== 'string' || data.length <= visibleChars * 2) {
    return '***';
  }

  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const masked = '*'.repeat(Math.min(data.length - visibleChars * 2, 8));

  return `${start}${masked}${end}`;
}
