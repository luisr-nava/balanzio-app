import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DeletePurchaseDto {
  @IsString()
  @IsNotEmpty({ message: 'La razón de eliminación es obligatoria' })
  @MinLength(10, { message: 'La razón debe tener al menos 10 caracteres' })
  deletionReason: string;
}
