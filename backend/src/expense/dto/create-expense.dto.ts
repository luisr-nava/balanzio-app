import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  description: string;

  @IsNumber()
  @IsPositive({ message: 'El monto debe ser positivo' })
  amount: number;

  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la tienda es obligatorio' })
  shopId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  date?: string;
}
