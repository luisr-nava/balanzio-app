import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Coca Cola 2L',
  })
  @IsString()
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Gaseosa Coca Cola sabor original 2 litros',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Código de barras del producto',
    example: '7790895001239',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El código de barras no puede exceder 50 caracteres' })
  barcode?: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 'uuid-tienda',
  })
  @IsUUID()
  shopId: string;

  @ApiProperty({
    description: 'Precio de costo del producto',
    example: 850.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  costPrice: number;

  @ApiProperty({
    description: 'Precio de venta del producto',
    example: 1200.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiPropertyOptional({
    description: 'Stock inicial del producto',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({
    description: 'ID del proveedor del producto',
    example: 'uuid-proveedor',
  })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({
    description: 'Tasa de IVA aplicable (0-27%)',
    example: 21,
    minimum: 0,
    maximum: 27,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(27)
  taxRate?: number;

  @ApiPropertyOptional({
    description: 'Categoría fiscal del producto',
    example: 'Gravado',
    enum: ['Gravado', 'Exento', 'No Alcanzado'],
  })
  @IsOptional()
  @IsEnum(['Gravado', 'Exento', 'No Alcanzado'], {
    message: 'Categoría fiscal inválida',
  })
  taxCategory?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría del producto',
    example: 'uuid-categoria',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
