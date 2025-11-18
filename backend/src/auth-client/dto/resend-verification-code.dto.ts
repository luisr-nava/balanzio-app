import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationCodeDto {
  @ApiProperty({
    description: 'Email del usuario para reenviar el código de verificación',
    example: 'usuario@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
