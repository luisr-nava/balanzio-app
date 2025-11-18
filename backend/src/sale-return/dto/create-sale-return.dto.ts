import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleReturnItemDto {
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @IsNotEmpty()
  shopProductId: string;

  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;

  @IsNumber()
  @IsPositive({ message: 'El precio unitario debe ser positivo' })
  unitPrice: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  condition?: string; // DEFECTIVE, EXPIRED, DAMAGED, etc.
}

export class CreateSaleReturnDto {
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la tienda es obligatorio' })
  shopId: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID de la venta debe ser un UUID válido' })
  saleId?: string;

  @IsString()
  @IsNotEmpty({ message: 'La razón es obligatoria' })
  @MinLength(10, { message: 'La razón debe tener al menos 10 caracteres' })
  reason: string;

  @IsEnum(['CASH', 'CREDIT', 'EXCHANGE'], {
    message: 'El tipo de reembolso debe ser CASH, CREDIT o EXCHANGE',
  })
  refundType: 'CASH' | 'CREDIT' | 'EXCHANGE';

  @IsNumber()
  @IsPositive({ message: 'El monto de reembolso debe ser positivo' })
  refundAmount: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un item' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleReturnItemDto)
  items: CreateSaleReturnItemDto[];
}
