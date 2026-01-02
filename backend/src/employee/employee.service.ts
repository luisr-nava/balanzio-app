import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}
  async registerEmployee(dto: CreateEmployeeDto, user: JwtPayload) {
    if (user.role !== 'OWNER') {
      throw new ForbiddenException('Solo los OWNER pueden crear empleados');
    }

    // Verificar si ya existe un empleado con el mismo email o DNI
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        OR: [{ email: dto.email }, { dni: dto.dni }],
      },
    });

    if (existingEmployee) {
      throw new BadRequestException(
        'Ya existe un empleado con el mismo email o DNI.',
      );
    }

    const employeeData = {
      id: dto.id,
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role ?? 'EMPLOYEE',
      dni: dto.dni,
      phone: dto.phone,
      address: dto.address,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      salary: dto.salary,
      notes: dto.notes,
      profileImage: dto.profileImage,
      emergencyContact: dto.emergencyContact,
    };

    const createdEmployee = await this.prisma.employee.create({
      data: employeeData,
    });

    return createdEmployee;
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto, user: JwtPayload) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        employeeShops: {
          include: {
            shop: {
              select: { ownerId: true, id: true },
            },
          },
        },
      },
    });
    if (!employee) throw new NotFoundException('Empleado no encontrado');

    const isOwner = user.role === 'OWNER';
    const isSelf = user.id === employee.id;

    if (isOwner) {
      const ownsEmployee = employee.employeeShops.some(
        (relation) => relation.shop.ownerId === user.id,
      );
      if (!ownsEmployee) {
        throw new ForbiddenException(
          'No tenés permiso para actualizar este empleado',
        );
      }
    } else if (!isSelf) {
      throw new ForbiddenException(
        'No tenés permiso para actualizar este empleado',
      );
    }

    if (dto.shopIds) {
      throw new BadRequestException(
        'Las asignaciones de tiendas no se actualizan desde este endpoint',
      );
    }

    const { shopIds: _ignoreShopIds, ...employeeData } = dto;

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: employeeData,
    });

    return updatedEmployee;
  }

  async findAll(user: JwtPayload, shopId: string, page = 1, limit = 10) {
    if (user.role !== 'OWNER') {
      throw new ForbiddenException('Solo los OWNER pueden ver los empleados');
    }
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: { id: true, ownerId: true, name: true },
    });
    if (!shop) {
      throw new NotFoundException('La tienda indicada no existe');
    }
    if (shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés acceso a esta tienda');
    }

    const skip = (page - 1) * limit;

    const where = {
      employeeShops: {
        some: {
          shopId,
        },
      },
    };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: {
          employeeShops: {
            where: { shopId },
            select: {
              shopId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      message: 'Empleados obtenidos correctamente',
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: JwtPayload) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        employeeShops: {
          select: {
            shop: {
              select: {
                id: true,
                name: true,
                ownerId: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const isOwner = user.role === 'OWNER';
    const isSelf = user.id === employee.id;
    if (isOwner) {
      const belongsToOwner = employee.employeeShops.some(
        (relation) => relation.shop.ownerId === user.id,
      );
      if (!belongsToOwner) {
        throw new ForbiddenException('No tenés acceso a este empleado');
      }
    } else if (!isSelf) {
      throw new ForbiddenException('No tenés permiso para ver este empleado');
    }

    return employee;
  }
}
