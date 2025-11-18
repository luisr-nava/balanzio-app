import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Disable2FADto {
  @ApiProperty({
    description: 'Código de 6 dígitos generado por la app de autenticación para confirmar la desactivación',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
  @Matches(/^\d{6}$/, { message: 'El código debe contener solo números' })
  code: string;
}
