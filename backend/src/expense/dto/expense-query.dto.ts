import { IsOptional, IsUUID } from 'class-validator';
import { CommonQueryWithDatesDto } from '../../common/dto';

export class ExpenseQueryDto extends CommonQueryWithDatesDto {
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  shopId?: string;
}
