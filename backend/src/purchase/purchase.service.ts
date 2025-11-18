import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePurchaseDto, PurchaseItemDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { DeletePurchaseDto } from './dto/delete-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { Prisma } from '@prisma/client';

interface PurchaseQuery {
  search?: string;
  page?: number;
  limit?: number;
  shopId?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(dto: CreatePurchaseDto, user: JwtPayload) {
    await this.validateShopAccess(dto.shopId, user);

    await this.validateSupplierIfExists(dto.supplierId, user);

    const shopProducts = await this.getShopProducts(dto.shopId, dto.items);

    return this.prisma.$transaction(async (tx) => {
      // Crear la compra principal
      const purchase = await tx.purchase.create({
        data: {
          shopId: dto.shopId,
          supplierId: dto.supplierId ?? null,
          notes: dto.notes ?? null,
          totalAmount: dto.items.reduce((acc, i) => acc + i.subtotal, 0),
        },
      });

      // Procesar cada item (esto queda en el create sin helpers nuevos)
      for (const item of dto.items) {
        const sp = shopProducts.find((p) => p.id === item.shopProductId);

        if (!sp) {
          throw new BadRequestException(
            `El producto con ID ${item.shopProductId} no fue encontrado.`,
          );
        }

        const previousStock = sp.stock ?? 0;
        const newStock = previousStock + item.quantity;

        // Crear registro del item de compra
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            shopProductId: item.shopProductId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.subtotal,
            includesTax: item.includesTax,
          },
        });

        // Actualizar stock y costo del producto en la tienda
        await tx.shopProduct.update({
          where: { id: item.shopProductId },
          data: {
            stock: newStock,
            costPrice: item.unitCost,
          },
        });

        // Crear historial del producto
        await tx.productHistory.create({
          data: {
            shopProductId: item.shopProductId,
            purchaseId: purchase.id,
            userId: user.id,
            changeType: 'STOCK_IN',
            previousStock,
            newStock,
            previousCost: sp.costPrice,
            newCost: item.unitCost,
            note: dto.notes,
          },
        });
      }

      return purchase;
    });
  }

  private async validateShopAccess(shopId: string, user: JwtPayload) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: { projectId: true, ownerId: true },
    });

    if (!shop) {
      throw new NotFoundException('Tienda no encontrada');
    }

    // Validar que la tienda pertenece al proyecto del usuario
    if (shop.projectId !== user.projectId) {
      throw new ForbiddenException('No tenés acceso a esta tienda');
    }

    // Si es OWNER, ya validamos projectId, permitir acceso
    if (user.role === 'OWNER') {
      return;
    }

    // Si es EMPLOYEE, validar que esté asignado a esta tienda específica
    const employee = await this.prisma.employee.findFirst({
      where: { id: user.id, shopId },
    });

    if (!employee) {
      throw new ForbiddenException(
        'No tenés permiso para operar en esta tienda.',
      );
    }
  }

  private async validateSupplierIfExists(
    supplierId: string | null | undefined,
    user: JwtPayload,
  ) {
    if (!supplierId) return;

    const exists = await this.prisma.supplier.findFirst({
      where: {
        id: supplierId,
        ownerId: user.id,
      },
    });

    if (!exists) {
      throw new BadRequestException(
        'El proveedor no existe o no pertenece al usuario.',
      );
    }
  }

  private async getShopProducts(shopId: string, items: PurchaseItemDto[]) {
    const ids = items.map((i) => i.shopProductId);

    const results = await this.prisma.shopProduct.findMany({
      where: { id: { in: ids }, shopId },
    });

    if (results.length !== items.length) {
      throw new ForbiddenException(
        'Uno o más productos no pertenecen a esta tienda.',
      );
    }

    return results;
  }

  private async createPurchaseRecord(
    tx: Prisma.TransactionClient,
    dto: CreatePurchaseDto,
  ) {
    return tx.purchase.create({
      data: {
        shopId: dto.shopId,
        supplierId: dto.supplierId ?? null,
        notes: dto.notes ?? null,
        totalAmount: dto.items.reduce((acc, item) => acc + item.subtotal, 0),
      },
    });
  }

  async findAll(user: JwtPayload, query: PurchaseQuery) {
    const {
      search,
      page = 1,
      limit = 20,
      shopId,
      supplierId,
      startDate,
      endDate,
    } = query;

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

    if (supplierId) {
      filters.supplierId = supplierId;
    }

    if (startDate || endDate) {
      filters.purchaseDate = {};
      if (startDate) {
        filters.purchaseDate.gte = new Date(startDate);
      }
      if (endDate) {
        filters.purchaseDate.lte = new Date(endDate);
      }
    }

    const [purchases, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where: filters,
        include: {
          shop: { select: { name: true } },
          supplier: { select: { name: true } },
          items: {
            include: {
              shopProduct: {
                include: {
                  product: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { purchaseDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchase.count({ where: filters }),
    ]);

    return {
      message:
        user.role === 'OWNER'
          ? 'Compras de todas tus tiendas'
          : 'Compras de tu tienda asignada',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: purchases.map((p) => ({
        id: p.id,
        shopId: p.shopId,
        shopName: p.shop.name,
        supplierId: p.supplierId,
        supplierName: p.supplier?.name,
        totalAmount: p.totalAmount,
        itemsCount: p.items.length,
        purchaseDate: p.purchaseDate,
        notes: p.notes,
        items: p.items.map((item) => ({
          id: item.id,
          shopProductId: item.shopProductId,
          productName: item.shopProduct.product.name,
          quantity: item.quantity,
          unitCost: item.unitCost,
          subtotal: item.subtotal,
          includesTax: item.includesTax,
        })),
      })),
    };
  }

  async findOne(id: string, user: JwtPayload) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
            ownerId: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contactName: true,
            phone: true,
            email: true,
          },
        },
        items: {
          include: {
            shopProduct: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    barcode: true,
                  },
                },
              },
            },
          },
        },
        histories: {
          select: {
            id: true,
            shopProductId: true,
            userId: true,
            changeType: true,
            previousStock: true,
            newStock: true,
            previousCost: true,
            newCost: true,
            createdAt: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('La compra no existe');
    }

    // Verificar permisos
    if (user.role === 'OWNER' && purchase.shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés permiso para ver esta compra');
    } else if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email, shopId: purchase.shopId },
      });
      if (!employee) {
        throw new ForbiddenException('No tenés permiso para ver esta compra');
      }
    }

    return {
      message: 'Compra encontrada',
      data: {
        id: purchase.id,
        shopId: purchase.shopId,
        shopName: purchase.shop.name,
        shopAddress: purchase.shop.address,
        supplierId: purchase.supplierId,
        supplier: purchase.supplier,
        totalAmount: purchase.totalAmount,
        purchaseDate: purchase.purchaseDate,
        notes: purchase.notes,
        items: purchase.items.map((item) => ({
          id: item.id,
          shopProductId: item.shopProductId,
          product: {
            id: item.shopProduct.product.id,
            name: item.shopProduct.product.name,
            description: item.shopProduct.product.description,
            barcode: item.shopProduct.product.barcode,
          },
          quantity: item.quantity,
          unitCost: item.unitCost,
          subtotal: item.subtotal,
          includesTax: item.includesTax,
        })),
        histories: purchase.histories,
      },
    };
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto, user: JwtPayload) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        shop: { select: { ownerId: true } },
      },
    });

    if (!purchase) {
      throw new NotFoundException('La compra no existe');
    }

    // Verificar permisos
    if (user.role === 'OWNER' && purchase.shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés permiso para actualizar esta compra');
    } else if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { email: user.email, shopId: purchase.shopId },
      });
      if (!employee) {
        throw new ForbiddenException('No tenés permiso para actualizar esta compra');
      }
    }

    // Validar proveedor si se está cambiando
    if (updatePurchaseDto.supplierId !== undefined) {
      await this.validateSupplierIfExists(updatePurchaseDto.supplierId, user);
    }

    // Por ahora solo permitimos actualizar notas y proveedor
    // No permitimos modificar los items porque ya se procesó el stock
    const updated = await this.prisma.purchase.update({
      where: { id },
      data: {
        notes: updatePurchaseDto.notes,
        supplierId: updatePurchaseDto.supplierId ?? purchase.supplierId,
      },
      include: {
        shop: { select: { name: true } },
        supplier: { select: { name: true } },
        items: {
          include: {
            shopProduct: {
              include: {
                product: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return {
      message: 'Compra actualizada correctamente',
      data: {
        id: updated.id,
        shopName: updated.shop.name,
        supplierName: updated.supplier?.name,
        totalAmount: updated.totalAmount,
        purchaseDate: updated.purchaseDate,
        notes: updated.notes,
        itemsCount: updated.items.length,
      },
    };
  }

  async getDeletionHistory(user: JwtPayload, query: PurchaseQuery) {
    const { page = 1, limit = 20, shopId } = query;

    // Solo los OWNER pueden ver el historial de eliminaciones
    if (user.role !== 'OWNER') {
      throw new ForbiddenException(
        'Solo los propietarios pueden ver el historial de eliminaciones',
      );
    }

    let accessibleShopIds: string[] = [];
    const shops = await this.prisma.shop.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });
    accessibleShopIds = shops.map((s) => s.id);

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

    const [deletions, total] = await Promise.all([
      this.prisma.purchaseDeletionHistory.findMany({
        where: filters,
        orderBy: { deletedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchaseDeletionHistory.count({ where: filters }),
    ]);

    return {
      message: 'Historial de compras eliminadas',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: deletions.map((d) => ({
        id: d.id,
        purchaseId: d.purchaseId,
        shopName: d.shopName,
        supplierName: d.supplierName,
        totalAmount: d.totalAmount,
        purchaseDate: d.purchaseDate,
        originalNotes: d.originalNotes,
        deletedBy: d.deletedByEmail,
        deletedAt: d.deletedAt,
        deletionReason: d.deletionReason,
        items: JSON.parse(d.itemsSnapshot),
      })),
    };
  }

  async remove(id: string, deletePurchaseDto: DeletePurchaseDto, user: JwtPayload) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        shop: { select: { id: true, name: true, ownerId: true } },
        supplier: { select: { id: true, name: true } },
        items: {
          include: {
            shopProduct: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    barcode: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('La compra no existe');
    }

    // Solo los OWNER pueden eliminar
    if (user.role !== 'OWNER' || purchase.shop.ownerId !== user.id) {
      throw new ForbiddenException('No tenés permiso para eliminar esta compra');
    }

    // Preparar snapshot de los items en formato JSON
    const itemsSnapshot = JSON.stringify(
      purchase.items.map((item) => ({
        shopProductId: item.shopProductId,
        productName: item.shopProduct.product.name,
        productBarcode: item.shopProduct.product.barcode,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: item.subtotal,
        includesTax: item.includesTax,
      })),
    );

    // Advertencia: eliminar una compra no revierte el stock
    // Esto debería ser una operación de anulación más compleja en producción
    await this.prisma.$transaction(async (tx) => {
      // 1. Guardar en historial de eliminaciones ANTES de eliminar
      await tx.purchaseDeletionHistory.create({
        data: {
          purchaseId: purchase.id,
          shopId: purchase.shopId,
          shopName: purchase.shop.name,
          supplierId: purchase.supplierId,
          supplierName: purchase.supplier?.name,
          totalAmount: purchase.totalAmount,
          purchaseDate: purchase.purchaseDate,
          originalNotes: purchase.notes,
          deletedBy: user.id,
          deletedByEmail: user.email || 'unknown@email.com',
          deletionReason: deletePurchaseDto.deletionReason,
          itemsSnapshot: itemsSnapshot,
        },
      });

      // 2. Eliminar historial de productos asociado
      await tx.productHistory.deleteMany({
        where: { purchaseId: id },
      });

      // 3. Eliminar items de compra
      await tx.purchaseItem.deleteMany({
        where: { purchaseId: id },
      });

      // 4. Eliminar compra
      await tx.purchase.delete({
        where: { id },
      });
    });

    return {
      message: 'Compra eliminada y guardada en historial correctamente',
      data: {
        id: purchase.id,
        shopName: purchase.shop.name,
        supplierName: purchase.supplier?.name,
        totalAmount: purchase.totalAmount,
        itemsCount: purchase.items.length,
        deletedBy: user.email || 'unknown@email.com',
        deletionReason: deletePurchaseDto.deletionReason,
        deletedAt: new Date(),
      },
    };
  }
}
