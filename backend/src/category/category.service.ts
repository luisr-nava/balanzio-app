import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

interface CategoryQuery {
  search?: string;
  page?: number;
  limit?: number;
  shopId?: string;
  includeInactive?: boolean;
}

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, user: JwtPayload) {
    const { id: userId, role, email } = user;

    // Verificar que la tienda existe
    const shop = await this.prisma.shop.findUnique({
      where: { id: createCategoryDto.shopId },
    });
    if (!shop) throw new NotFoundException('La tienda no existe');

    // Verificar permisos
    if (role === 'OWNER' && shop.ownerId !== userId) {
      throw new ForbiddenException('No tenés permiso para crear categorías en esta tienda');
    } else if (role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email, shopId: createCategoryDto.shopId },
      });
      if (!employee) {
        throw new ForbiddenException('No tenés permiso para crear categorías en esta tienda');
      }
    }

    // Verificar que no exista una categoría con el mismo nombre en la tienda
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name_shopId: {
          name: createCategoryDto.name,
          shopId: createCategoryDto.shopId,
        },
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre "${createCategoryDto.name}" en esta tienda`,
      );
    }

    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        shopId: createCategoryDto.shopId,
        createdBy: userId,
      },
      include: {
        shop: {
          select: { name: true },
        },
      },
    });

    return {
      message: 'Categoría creada correctamente',
      data: {
        id: category.id,
        name: category.name,
        shopId: category.shopId,
        shopName: category.shop.name,
        createdAt: category.createdAt,
        isActive: category.isActive,
      },
    };
  }

  async findAll(user: JwtPayload, query: CategoryQuery) {
    const { search, page = 1, limit = 20, shopId, includeInactive = false } = query;

    let accessibleShopIds: string[] = [];
    if (user.role === 'OWNER') {
      const shops = await this.prisma.shop.findMany({
        where: { ownerId: user.id },
        select: { id: true },
      });
      accessibleShopIds = shops.map((s) => s.id);
    } else {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email },
        select: { shopId: true },
      });

      if (!employee) {
        throw new ForbiddenException('No se encontró información del empleado');
      }

      accessibleShopIds = [employee.shopId];
    }

    if (shopId && !accessibleShopIds.includes(shopId)) {
      throw new ForbiddenException('No tenés acceso a esta tienda');
    }

    const targetShopIds = shopId ? [shopId] : accessibleShopIds;

    if (targetShopIds.length === 0) {
      throw new ForbiddenException('No tenés tiendas asignadas');
    }

    const filters: any = {
      shopId: { in: targetShopIds },
    };

    if (!includeInactive) {
      filters.isActive = true;
    }

    if (search) {
      filters.name = { contains: search, mode: 'insensitive' };
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: filters,
        include: {
          shop: { select: { name: true } },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.category.count({ where: filters }),
    ]);

    return {
      message: user.role === 'OWNER'
        ? 'Categorías de todas tus tiendas'
        : 'Categorías de tu tienda asignada',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        shopId: cat.shopId,
        shopName: cat.shop.name,
        productsCount: cat._count.products,
        isActive: cat.isActive,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      })),
    };
  }

  async findOne(id: string, user: JwtPayload) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        shop: { select: { name: true, ownerId: true } },
        products: {
          select: {
            id: true,
            name: true,
            barcode: true,
          },
          take: 10,
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    // Verificar permisos
    if (user.role === 'OWNER' && category.shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés permiso para ver esta categoría');
    } else if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email, shopId: category.shopId },
      });
      if (!employee) {
        throw new ForbiddenException('No tenés permiso para ver esta categoría');
      }
    }

    return {
      message: 'Categoría encontrada',
      data: {
        id: category.id,
        name: category.name,
        shopId: category.shopId,
        shopName: category.shop.name,
        isActive: category.isActive,
        productsCount: category._count.products,
        sampleProducts: category.products,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: JwtPayload) {
    const { id: userId } = user;

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        shop: { select: { ownerId: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    // Verificar permisos
    if (user.role === 'OWNER' && category.shop.ownerId !== userId) {
      throw new ForbiddenException('No tenés permiso para actualizar esta categoría');
    } else if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email, shopId: category.shopId },
      });
      if (!employee) {
        throw new ForbiddenException('No tenés permiso para actualizar esta categoría');
      }
    }

    // Si se está cambiando el nombre, verificar que no exista otra con ese nombre
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          name_shopId: {
            name: updateCategoryDto.name,
            shopId: category.shopId,
          },
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Ya existe una categoría con el nombre "${updateCategoryDto.name}" en esta tienda`,
        );
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        updatedBy: userId,
      },
    });

    return {
      message: 'Categoría actualizada correctamente',
      data: {
        id: updated.id,
        name: updated.name,
        shopId: updated.shopId,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      },
    };
  }

  async toggleActive(id: string, user: JwtPayload) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        shop: { select: { name: true, ownerId: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    // Solo los owners pueden desactivar/activar
    if (user.role !== 'OWNER' || category.shop.ownerId !== user.id) {
      throw new ForbiddenException(
        'No tenés permiso para cambiar el estado de esta categoría',
      );
    }

    const newStatus = !category.isActive;

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        isActive: newStatus,
        disabledAt: newStatus ? null : new Date(),
        disabledBy: newStatus ? null : user.id,
      },
    });

    return {
      message: `Categoría ${newStatus ? 'activada' : 'desactivada'} correctamente`,
      data: {
        id: updated.id,
        name: updated.name,
        shop: category.shop.name,
        isActive: updated.isActive,
        productsCount: category._count.products,
      },
    };
  }

  async remove(id: string, user: JwtPayload) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        shop: { select: { ownerId: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    // Solo los owners pueden eliminar
    if (user.role !== 'OWNER' || category.shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés permiso para eliminar esta categoría');
    }

    // No permitir eliminar si tiene productos asociados
    if (category._count.products > 0) {
      throw new ConflictException(
        `No se puede eliminar la categoría porque tiene ${category._count.products} producto(s) asociado(s). Desactívala en su lugar.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Categoría eliminada correctamente',
      data: {
        id: category.id,
        name: category.name,
      },
    };
  }
}
