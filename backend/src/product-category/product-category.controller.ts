import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { SearchQueryWithShopAndInactiveDto } from '../common/dto';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.productCategoryService.create(createProductCategoryDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @GetUser() user: JwtPayload,
    @Query() query: SearchQueryWithShopAndInactiveDto,
  ) {
    return this.productCategoryService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.productCategoryService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.productCategoryService.update(
      id,
      updateProductCategoryDto,
      user,
    );
  }

  @Patch('toggle/:id')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.productCategoryService.toggleActive(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.productCategoryService.remove(id, user);
  }
}
