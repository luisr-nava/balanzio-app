import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class PurchaseItemDto {
  @IsUUID()
  @IsNotEmpty()
  shopProductId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitCost: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsBoolean()
  includesTax: boolean;
}

export class CreatePurchaseDto {
  @IsUUID()
  @IsNotEmpty()
  shopId: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
