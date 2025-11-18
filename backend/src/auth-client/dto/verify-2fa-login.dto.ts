import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FALoginDto {
  @ApiProperty({
    description: 'Token temporal recibido durante el login cuando 2FA está habilitado',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  tempToken: string;

  @ApiProperty({
    description: 'Código de 6 dígitos generado por la app de autenticación o código de recuperación',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
