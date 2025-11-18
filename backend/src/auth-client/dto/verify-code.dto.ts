import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({
    description: 'Código de verificación de 6 dígitos',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, {
    message: 'El código de verificación debe tener 6 dígitos',
  })
  code: string;
}
