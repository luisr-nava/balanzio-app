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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { SearchQueryWithShopAndInactiveDto } from '../common/dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @GetUser() user: JwtPayload,
    @Query() query: SearchQueryWithShopAndInactiveDto,
  ) {
    return this.categoryService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.categoryService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.categoryService.update(id, updateCategoryDto, user);
  }

  @Patch('toggle/:id')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.categoryService.toggleActive(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.categoryService.remove(id, user);
  }
}
