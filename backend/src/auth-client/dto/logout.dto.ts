import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'Razón del logout (opcional)',
    example: 'User requested logout',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}
