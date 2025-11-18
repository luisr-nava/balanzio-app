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
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { JwtAuthGuard } from '../auth-client/guards/jwt-auth.guard';
import { GetUser } from '../auth-client/decorators/get-user.decorator';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

@ApiTags('Gastos')
@ApiBearerAuth('JWT-auth')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar gasto', description: 'Registra un nuevo gasto en la tienda' })
  @ApiResponse({ status: 201, description: 'Gasto creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos (solo OWNER)' })
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: JwtPayload) {
    return this.expenseService.create(createExpenseDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar gastos', description: 'Obtiene todos los gastos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de gastos obtenida' })
  findAll(
    @GetUser() user: JwtPayload,
    @Query() query: ExpenseQueryDto,
  ) {
    return this.expenseService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener gasto', description: 'Obtiene un gasto específico por ID' })
  @ApiParam({ name: 'id', description: 'ID del gasto' })
  @ApiResponse({ status: 200, description: 'Gasto obtenido' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.expenseService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar gasto', description: 'Actualiza la información de un gasto' })
  @ApiParam({ name: 'id', description: 'ID del gasto' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar gasto', description: 'Elimina un gasto del sistema' })
  @ApiParam({ name: 'id', description: 'ID del gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado' })
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.expenseService.remove(id, user);
  }
}
