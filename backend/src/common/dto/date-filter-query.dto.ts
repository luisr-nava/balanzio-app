import { IsOptional, IsDateString } from 'class-validator';

export class DateFilterQueryDto {
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  endDate?: string;
}
