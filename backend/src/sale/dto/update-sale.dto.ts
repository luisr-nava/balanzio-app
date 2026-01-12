import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleDto } from './create-sale.dto';

export class UpdateSaleItemDto {
  @IsUUID()
  @IsNotEmpty()
  shopProductId: string;

  @IsNumber()
  @Min(0.000001, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;
}

// Solo permitir actualizar ciertos campos (no shopId)
export class UpdateSaleDto extends PartialType(
  OmitType(CreateSaleDto, ['items', 'shopId'] as const),
) {
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un item' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleItemDto)
  @IsOptional()
  items?: UpdateSaleItemDto[];
}
