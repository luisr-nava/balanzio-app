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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { SearchQueryWithShopDto } from '../common/dto';

@ApiTags('Productos')
@ApiBearerAuth('JWT-auth')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear producto', description: 'Crea un nuevo producto en una tienda' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.productService.createProduct(createProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto', description: 'Actualiza la información de un producto existente' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 'uuid-producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.productService.updateProduct(id, updateProductDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar productos', description: 'Obtiene todos los productos con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida' })
  findAll(
    @GetUser() user: JwtPayload,
    @Query() query: SearchQueryWithShopDto,
  ) {
    return this.productService.getAllProducts(user, query);
  }

  @Patch('toggle/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Activar/Desactivar producto', description: 'Cambia el estado activo/inactivo de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 'uuid-producto' })
  @ApiResponse({ status: 200, description: 'Estado del producto cambiado' })
  toggleProduct(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.productService.toggleActiveProduct(id, user);
  }

  @Get('barcode/:barcode')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buscar producto por código de barras', description: 'Busca un producto usando su código de barras' })
  @ApiParam({ name: 'barcode', description: 'Código de barras del producto', example: '7790895001239' })
  @ApiQuery({ name: 'shopId', description: 'ID de la tienda', example: 'uuid-tienda' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getByBarcode(
    @Param('barcode') barcode: string,
    @Query('shopId') shopId: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.productService.getProductByBarcode(barcode, user, shopId);
  }
}
