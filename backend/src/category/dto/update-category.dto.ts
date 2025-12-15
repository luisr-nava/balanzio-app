import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Permitimos las mismas propiedades que en creación (name, shopIds) pero opcionales
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
