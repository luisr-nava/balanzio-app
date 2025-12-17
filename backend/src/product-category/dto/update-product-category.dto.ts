import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product-category.dto';

// Permitimos las mismas propiedades que en creación (name, shopIds) pero opcionales
export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {}
