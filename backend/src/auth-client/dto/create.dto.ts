import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 5,
    maxLength: 20,
  })
  @IsNotEmpty({
    message: 'El nombre de usuario es requerido',
  })
  @Length(5, 20, {
    message: 'El nombre de usuario debe tener entre 5 y 20 caracteres',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.OWNER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '+54 9 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'DNI del usuario',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  @Length(7, 15, { message: 'El DNI debe tener entre 7 y 15 caracteres' })
  dni?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Corrientes 1234, CABA',
  })
  @IsOptional()
  @IsString()
  @Length(5, 200, { message: 'La dirección debe tener entre 5 y 200 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Fecha de contratación',
    example: '2024-01-15',
  })
  @IsDate()
  @IsOptional()
  hireDate?: string;

  @ApiPropertyOptional({
    description: 'Salario del empleado',
    example: '150000',
  })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Empleado con experiencia en ventas',
  })
  @IsString()
  @MaxLength(500, { message: 'Las notas no pueden exceder 500 caracteres' })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de perfil',
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  @MaxLength(500, { message: 'La URL de imagen no puede exceder 500 caracteres' })
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    description: 'Contacto de emergencia',
    example: 'María Pérez - +54 9 11 8765-4321',
  })
  @IsString()
  @MaxLength(200, { message: 'El contacto de emergencia no puede exceder 200 caracteres' })
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({
    description: 'ID del proyecto al que pertenece (auto-generado para OWNER)',
    example: 'uuid-del-proyecto',
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Indica si el usuario está verificado',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerify?: boolean;
}
