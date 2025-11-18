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
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo cliente',
    description: 'Crea un nuevo cliente para una tienda',
  })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(@Body() dto: CreateCustomerDto, @GetUser() user: JwtPayload) {
    return this.customerService.create(dto, user);
  }

  @Get('shop/:shopId')
  @ApiOperation({
    summary: 'Listar clientes de una tienda',
    description: 'Obtiene todos los clientes de una tienda específica',
  })
  @ApiParam({ name: 'shopId', description: 'ID de la tienda' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Incluir clientes inactivos',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida' })
  findAll(
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @GetUser() user: JwtPayload,
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive?: boolean,
  ) {
    return this.customerService.findAll(shopId, user, includeInactive);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cliente por ID',
    description:
      'Obtiene un cliente con sus ventas pendientes y movimientos recientes',
  })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.customerService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar cliente',
    description: 'Actualiza los datos de un cliente',
  })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.customerService.update(id, dto, user);
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Activar/desactivar cliente',
    description:
      'Alterna el estado activo/inactivo del cliente (no se puede desactivar si tiene deuda)',
  })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Estado cambiado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'No se puede desactivar cliente con deuda',
  })
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.customerService.toggleActive(id, user);
  }

  // PAGOS
  @Post('payment')
  @ApiOperation({
    summary: 'Registrar pago de cliente',
    description: 'Registra un pago de cuenta corriente y actualiza el saldo',
  })
  @ApiResponse({ status: 201, description: 'Pago registrado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Monto inválido o mayor a la deuda',
  })
  createPayment(@Body() dto: CreatePaymentDto, @GetUser() user: JwtPayload) {
    return this.customerService.createPayment(dto, user);
  }

  @Get(':id/payments')
  @ApiOperation({
    summary: 'Historial de pagos del cliente',
    description: 'Obtiene todos los pagos realizados por un cliente',
  })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Historial de pagos obtenido' })
  getPaymentHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.customerService.getPaymentHistory(id, user);
  }

  @Get(':id/account-statement')
  @ApiOperation({
    summary: 'Estado de cuenta del cliente',
    description:
      'Obtiene el estado de cuenta con todos los movimientos (ventas y pagos)',
  })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Estado de cuenta obtenido' })
  getAccountStatement(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.customerService.getAccountStatement(id, user);
  }
}
