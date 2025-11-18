import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Email del cliente',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del cliente',
    example: '+54 9 11 1234-5678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'DNI del cliente',
    example: '12345678',
  })
  @IsString()
  @IsOptional()
  dni?: string;

  @ApiPropertyOptional({
    description: 'Dirección del cliente',
    example: 'Av. Corrientes 1234, CABA',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Límite de crédito para cuenta corriente',
    example: 50000,
    default: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El límite de crédito debe ser mayor o igual a 0' })
  @IsOptional()
  creditLimit?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el cliente',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 'uuid-de-la-tienda',
  })
  @IsString()
  @IsNotEmpty({ message: 'El ID de la tienda es requerido' })
  shopId: string;
}
