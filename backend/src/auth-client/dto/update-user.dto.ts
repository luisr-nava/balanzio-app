import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Nueva contraseña del usuario',
    example: 'NuevaPassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
