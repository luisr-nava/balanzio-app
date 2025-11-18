import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

@ApiTags('Ventas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva venta',
    description:
      'Registra una nueva venta, actualiza stock, calcula IVA y maneja cuenta corriente',
  })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o stock insuficiente',
  })
  create(@Body() dto: CreateSaleDto, @GetUser() user: JwtPayload) {
    return this.saleService.create(dto, user);
  }

  @Get('shop/:shopId')
  @ApiOperation({
    summary: 'Listar ventas de una tienda',
    description: 'Obtiene todas las ventas de una tienda con filtros opcionales',
  })
  @ApiParam({ name: 'shopId', description: 'ID de la tienda' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Fecha inicio (ISO)',
  })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha fin (ISO)' })
  findAll(
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @GetUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.saleService.findAll(shopId, user, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener venta por ID',
    description: 'Obtiene el detalle completo de una venta',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.saleService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar venta',
    description:
      'Actualiza datos de una venta (notas, factura). No modifica items ni totales.',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSaleDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.saleService.update(id, dto, user);
  }

  @Delete(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar venta',
    description:
      'Cancela una venta, devuelve stock y revierte cuenta corriente si aplica',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { reason: { type: 'string', example: 'Error en facturación' } },
      required: ['reason'],
    },
  })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.saleService.cancel(id, user, reason);
  }
}
