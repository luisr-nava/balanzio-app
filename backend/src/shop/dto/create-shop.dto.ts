import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
export class CreateShopDto {
  @IsString({
    message: 'Name must be a string',
  })
  @Length(4, 20, {
    message: 'Name must be between 4 and 20 characters',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'Address must be a string',
  })
  @Length(4, 20, {
    message: 'Address must be between 4 and 20 characters',
  })
  address: string;

  @IsOptional()
  @IsString({
    message: 'Phone must be a string',
  })
  phone: string;

  @IsOptional()
  @IsBoolean({
    message: 'isActive must be a boolean',
  })
  isActive: boolean;
}
