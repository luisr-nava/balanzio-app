import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class DeletionHistoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  shopId?: string;
}
