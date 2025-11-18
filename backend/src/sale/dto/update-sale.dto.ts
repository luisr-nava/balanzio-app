import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';

// Solo permitir actualizar ciertos campos (no items ni shopId)
export class UpdateSaleDto extends PartialType(
  OmitType(CreateSaleDto, ['items', 'shopId'] as const),
) {}
