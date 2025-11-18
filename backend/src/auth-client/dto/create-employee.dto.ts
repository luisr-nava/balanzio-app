import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Nombre completo del empleado',
    example: 'María González',
    minLength: 5,
    maxLength: 50,
  })
  @IsNotEmpty({
    message: 'El nombre completo es requerido',
  })
  @Length(5, 50, {
    message: 'El nombre debe tener entre 5 y 50 caracteres',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email del empleado',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'El email es requerido',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del empleado',
    example: 'Password123',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Teléfono del empleado',
    example: '+54 9 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'DNI del empleado',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({
    description: 'Dirección del empleado',
    example: 'Av. Corrientes 1234, CABA',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Fecha de contratación',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsString()
  hireDate?: string;

  @ApiPropertyOptional({
    description: 'Salario del empleado',
    example: '150000',
  })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Empleado con experiencia en ventas',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
