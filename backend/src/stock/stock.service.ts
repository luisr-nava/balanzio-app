import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

type StockReason =
  | 'sale'
  | 'purchase'
  | 'sale_return'
  | 'purchase_cancel'
  | 'adjustment';

interface UpdateStockParams {
  shopProductId: string;
  delta: number;
  userId: string;
  reason: StockReason;
  note?: string;
  tx?: Prisma.TransactionClient;
}

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async updateStock(params: UpdateStockParams) {
    const { shopProductId, delta, userId, reason, note, tx } = params;
    const client = tx ?? this.prisma;

    const shopProduct = await client.shopProduct.findUnique({
      where: { id: shopProductId },
      include: {
        product: true,
        shop: {
          select: {
            id: true,
            ownerId: true,
            lowStockThreshold: true,
          },
        },
      },
    });

    if (!shopProduct) {
      throw new NotFoundException('Producto de tienda no encontrado');
    }

    const stockBefore = shopProduct.stock ?? 0;
    const stockAfter = stockBefore + delta;

    await client.shopProduct.update({
      where: { id: shopProductId },
      data: { stock: stockAfter },
    });

    await client.productHistory.create({
      data: {
        shopProductId,
        userId,
        changeType: reason,
        previousStock: stockBefore,
        newStock: stockAfter,
        note,
      },
    });

    const threshold = shopProduct.shop.lowStockThreshold ?? 5;
    const isLowStock = stockAfter <= threshold;

    if (isLowStock) {
      await this.notificationService.createNotification({
        userId: shopProduct.shop.ownerId,
        shopId: shopProduct.shopId,
        type: 'LOW_STOCK',
        title: 'Stock bajo',
        message: `${shopProduct.product.name} tiene stock ${stockAfter} por debajo del umbral (${threshold})`,
      });
    }

    return { stockBefore, stockAfter };
  }
}
