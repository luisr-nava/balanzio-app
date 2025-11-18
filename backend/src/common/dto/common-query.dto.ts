import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';
import { DateFilterQueryDto } from './date-filter-query.dto';

export class CommonQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser un texto válido' })
  search?: string;
}

export class CommonQueryWithDatesDto extends CommonQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
