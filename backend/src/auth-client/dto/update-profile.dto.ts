import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña',
    example: 'NuevaPassword123',
    minLength: 8,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '+54 9 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Corrientes 1234, CABA',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de perfil',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
