import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Shop } from './entities/shop.entity';
import { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async createShop(user: JwtPayload, dto: CreateShopDto) {
    if (user.role !== 'OWNER') {
      throw new ForbiddenException('Solo un Dueño puede crear tiendas');
    }
    const shopCount = await this.prisma.shop.count({
      where: { ownerId: user.id },
    });

    if (shopCount >= 3) {
      throw new ForbiddenException(
        'Ya alcanzaste el límite de 3 tiendas permitidas',
      );
    }

    const shop = await this.prisma.shop.create({
      data: {
        name: dto.name,
        address: dto.address,
        ownerId: user.id,
        projectId: user.projectId,
        phone: dto.phone,
        isActive: dto.isActive,
      },
    });

    return {
      message: 'Tienda creada correctamente',
      shop,
    };
  }

  async getMyShops(user: JwtPayload): Promise<Shop[]> {
    return this.prisma.shop.findMany({
      where: {
        ownerId: user.id,
        projectId: user.projectId,
      },
      include: {
        employees: true,
        sales: true,
        incomes: true,
        expenses: true,
        shopProducts: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShopById(id: string, user: JwtPayload) {
    if (user.role === 'OWNER') {
      const shop = await this.prisma.shop.findFirst({
        where: {
          id,
          ownerId: user.id,
          projectId: user.projectId,
        },
        include: {
          employees: true,
          sales: true,
          incomes: true,
          expenses: true,
          shopProducts: {
            include: { product: true },
          },
        },
      });
      if (!shop) {
        throw new ForbiddenException('No tenés permiso para ver esta tienda');
      }

      return shop;
    }
    if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: {
          email: user.email,
        },
      });
      if (!employee) {
        throw new ForbiddenException('No estás asignado a ninguna tienda');
      }
      if (employee.shopId !== id) {
        throw new ForbiddenException('No podés acceder a esta tienda');
      }
      const shop = await this.prisma.shop.findFirst({
        where: { id: employee.shopId },
        include: {
          employees: true,
          sales: true,
          incomes: true,
          expenses: true,
          shopProducts: { include: { product: true } },
        },
      });

      return shop;
    }
    throw new ForbiddenException(
      'No tenés permisos para acceder a esta información',
    );
  }

  async updateShop(id: string, updateShopDto: UpdateShopDto, user: JwtPayload) {
    if (user.role !== 'OWNER') {
      throw new ForbiddenException('Solo un Dueño puede actualizar tiendas');
    }
    const shop = await this.prisma.shop.findFirst({
      where: {
        id,
        ownerId: user.id,
        projectId: user.projectId,
      },
    });

    if (!shop) {
      throw new ForbiddenException('Tienda no encontrada o sin permiso');
    }

    const updateShop = await this.prisma.shop.update({
      where: { id },
      data: {
        name: updateShopDto.name ?? shop.name,
        address: updateShopDto.address ?? shop.address,
        isActive: updateShopDto.isActive ?? shop.isActive,
        phone: updateShopDto.phone ?? shop.phone,
      },
    });

    return {
      message: 'Tienda actualizada correctamente',
      updateShop,
    };
  }

  async toggleShop(id: string, user: JwtPayload) {
    if (user.role !== 'OWNER') {
      throw new ForbiddenException('Solo un OWNER puede deshabilitar tiendas');
    }
    const shop = await this.prisma.shop.findFirst({
      where: {
        id,
        ownerId: user.id,
        projectId: user.projectId,
      },
    });

    if (!shop) {
      throw new NotFoundException('Tienda no encontrada o sin permisos');
    }

    const updated = await this.prisma.shop.update({
      where: { id },
      data: { isActive: !shop.isActive },
    });

    return {
      message: `Tienda ${updated.isActive ? 'habilitada' : 'deshabilitada'} correctamente`,
      shop: updated,
    };
  }
}
