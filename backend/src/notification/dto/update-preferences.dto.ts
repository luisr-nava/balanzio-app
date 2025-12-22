import { IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsBoolean()
  lowStockEnabled: boolean;

  @IsInt()
  @Min(0)
  lowStockThreshold: number;
}
