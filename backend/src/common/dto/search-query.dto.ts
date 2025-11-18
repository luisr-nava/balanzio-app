import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonQueryDto } from './common-query.dto';

export class SearchQueryWithInactiveDto extends CommonQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'includeInactive debe ser un booleano' })
  includeInactive?: boolean;
}

export class SearchQueryWithShopDto extends CommonQueryDto {
  @IsOptional()
  @IsString({ message: 'El ID de la tienda debe ser válido' })
  shopId?: string;
}

export class SearchQueryWithShopAndInactiveDto extends SearchQueryWithShopDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'includeInactive debe ser un booleano' })
  includeInactive?: boolean;
}
