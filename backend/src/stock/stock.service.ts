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
        shop: { select: { id: true, ownerId: true } },
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

    await this.notificationService.handleLowStock({
      shopId: shopProduct.shopId,
      productId: shopProduct.productId,
      productName: shopProduct.product.name,
      stockBefore,
      stockAfter,
      ownerId: shopProduct.shop.ownerId,
    });

    return { stockBefore, stockAfter };
  }
}
