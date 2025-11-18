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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeQueryDto } from './dto/income-query.dto';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

@ApiTags('Ingresos')
@ApiBearerAuth('JWT-auth')
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar ingreso', description: 'Registra un nuevo ingreso en la tienda' })
  @ApiResponse({ status: 201, description: 'Ingreso creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos (solo OWNER)' })
  create(@Body() createIncomeDto: CreateIncomeDto, @GetUser() user: JwtPayload) {
    return this.incomeService.create(createIncomeDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar ingresos', description: 'Obtiene todos los ingresos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de ingresos obtenida' })
  findAll(
    @GetUser() user: JwtPayload,
    @Query() query: IncomeQueryDto,
  ) {
    return this.incomeService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener ingreso', description: 'Obtiene un ingreso específico por ID' })
  @ApiParam({ name: 'id', description: 'ID del ingreso' })
  @ApiResponse({ status: 200, description: 'Ingreso obtenido' })
  @ApiResponse({ status: 404, description: 'Ingreso no encontrado' })
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.incomeService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar ingreso', description: 'Actualiza la información de un ingreso' })
  @ApiParam({ name: 'id', description: 'ID del ingreso' })
  @ApiResponse({ status: 200, description: 'Ingreso actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.incomeService.update(id, updateIncomeDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar ingreso', description: 'Elimina un ingreso del sistema' })
  @ApiParam({ name: 'id', description: 'ID del ingreso' })
  @ApiResponse({ status: 200, description: 'Ingreso eliminado' })
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.incomeService.remove(id, user);
  }
}
