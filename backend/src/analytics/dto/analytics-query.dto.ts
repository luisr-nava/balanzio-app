import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export enum AnalyticsPeriod {
  DAY = 'day',
  RANGE = 'range',
  MONTH = 'month',
  YEAR = 'year',
}

export const ANALYTICS_MODULES = ['sales', 'purchases', 'incomes', 'expenses', 'topProducts'] as const;
export type AnalyticsModule = (typeof ANALYTICS_MODULES)[number];

export class AnalyticsQueryDto {
  @IsString()
  @IsNotEmpty()
  shopId!: string;

  @IsEnum(AnalyticsPeriod)
  period!: AnalyticsPeriod;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  from!: string;

  @ValidateIf((o) => o.period === AnalyticsPeriod.RANGE)
  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(ANALYTICS_MODULES, { each: true })
  modules?: AnalyticsModule[];
}
