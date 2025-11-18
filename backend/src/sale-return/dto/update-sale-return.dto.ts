import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSaleReturnDto {
  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'], {
    message: 'El estado debe ser PENDING, APPROVED, REJECTED o PROCESSED',
  })
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';

  @IsOptional()
  @IsString()
  notes?: string;
}
