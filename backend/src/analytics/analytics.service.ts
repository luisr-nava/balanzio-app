import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  ANALYTICS_MODULES,
  AnalyticsModule,
  AnalyticsPeriod,
  AnalyticsQueryDto,
} from './dto/analytics-query.dto';

type BucketUnit = 'day' | 'month';
type SeriesPoint = { label: string; value: number };

type TimeSeriesPayload = {
  series: SeriesPoint[];
  total: number;
};

export type TopProductResult = {
  shopProductId: string;
  productId: string | null;
  productName: string | null;
  quantity: number;
  total: number;
};

@Injectable()
export class AnalyticsService {
  private readonly defaultModules = new Set<AnalyticsModule>(ANALYTICS_MODULES);

  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(query: AnalyticsQueryDto, user: JwtPayload) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: query.shopId },
      select: { id: true, projectId: true, currencyCode: true },
    });

    if (!shop) {
      throw new BadRequestException('La tienda no existe');
    }

    await this.ensureShopAccess(shop.id, shop.projectId, user);

    const { startDate, endDate, bucketUnit } = this.resolvePeriodRange(query);
    const modules = this.buildModuleSet(query.modules);

    const sales = modules.has('sales')
      ? await this.buildSalesSeries(shop.id, startDate, endDate, bucketUnit)
      : this.buildEmptySeries(startDate, endDate, bucketUnit);

    const purchases = modules.has('purchases')
      ? await this.buildPurchasesSeries(shop.id, startDate, endDate, bucketUnit)
      : this.buildEmptySeries(startDate, endDate, bucketUnit);

    const incomes = modules.has('incomes')
      ? await this.buildIncomesSeries(shop.id, startDate, endDate, bucketUnit)
      : this.buildEmptySeries(startDate, endDate, bucketUnit);

    const expenses = modules.has('expenses')
      ? await this.buildExpensesSeries(shop.id, startDate, endDate, bucketUnit)
      : this.buildEmptySeries(startDate, endDate, bucketUnit);

    const topProducts = modules.has('topProducts')
      ? await this.buildTopProducts(shop.id, startDate, endDate)
      : [];

    return {
      shopId: query.shopId,
      period: query.period,
      from: query.from,
      to: query.period === AnalyticsPeriod.RANGE ? query.to ?? null : null,
      currency: shop.currencyCode ?? 'USD',
      data: {
        sales,
        purchases,
        incomes,
        expenses,
        topProducts,
      },
    };
  }

  private buildModuleSet(modules?: AnalyticsModule[]) {
    if (modules && modules.length > 0) {
      return new Set(modules);
    }

    return new Set(this.defaultModules);
  }

  private async ensureShopAccess(
    shopId: string,
    projectId: string,
    user: JwtPayload,
  ) {
    if (projectId !== user.projectId) {
      throw new ForbiddenException('No tenés acceso a esta tienda');
    }

    if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: {
          id: user.id,
          employeeShops: {
            some: { shopId },
          },
        },
      });

      if (!employee) {
        throw new ForbiddenException('No tenés permiso para esta tienda');
      }
    }
  }

  private resolvePeriodRange(query: AnalyticsQueryDto) {
    const fromDate = new Date(query.from);
    if (Number.isNaN(fromDate.getTime())) {
      throw new BadRequestException('Fecha de inicio inválida');
    }

    let startDate: Date;
    let endDate: Date;
    let bucketUnit: BucketUnit = 'day';

    switch (query.period) {
      case AnalyticsPeriod.DAY:
        startDate = this.startOfDay(fromDate);
        endDate = this.endOfDay(fromDate);
        break;
      case AnalyticsPeriod.MONTH:
        startDate = this.startOfMonth(fromDate);
        endDate = this.endOfMonth(fromDate);
        break;
      case AnalyticsPeriod.YEAR:
        startDate = this.startOfYear(fromDate);
        endDate = this.endOfYear(fromDate);
        bucketUnit = 'month';
        break;
      case AnalyticsPeriod.RANGE:
        if (!query.to) {
          throw new BadRequestException('El parámetro to es obligatorio para period range');
        }
        const toDate = new Date(query.to);
        if (Number.isNaN(toDate.getTime())) {
          throw new BadRequestException('Fecha final inválida');
        }
        startDate = this.startOfDay(fromDate);
        endDate = this.endOfDay(toDate);
        bucketUnit = 'day';
        if (startDate > endDate) {
          throw new BadRequestException('El rango debe comenzar antes de finalizar');
        }
        break;
      default:
        throw new BadRequestException('Periodo inválido');
    }

    return { startDate, endDate, bucketUnit };
  }

  private async buildSalesSeries(
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<TimeSeriesPayload> {
    const groups = await this.prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        shopId,
        status: 'COMPLETED',
        saleDate: { gte: startDate, lte: endDate },
      },
      _sum: { totalAmount: true },
      orderBy: { saleDate: 'asc' },
    });

    // Prisma groupBy (saleDate) + _sum.totalAmount
    return this.buildSeriesFromGroups(
      groups.map((group) => ({ date: group.saleDate, amount: group._sum.totalAmount ?? 0 })),
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private async buildPurchasesSeries(
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<TimeSeriesPayload> {
    const groups = await this.prisma.purchase.groupBy({
      by: ['purchaseDate'],
      where: {
        shopId,
        status: 'COMPLETED',
        purchaseDate: { gte: startDate, lte: endDate },
      },
      _sum: { totalAmount: true },
      orderBy: { purchaseDate: 'asc' },
    });

    return this.buildSeriesFromGroups(
      groups.map((group) => ({ date: group.purchaseDate, amount: group._sum.totalAmount ?? 0 })),
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private async buildIncomesSeries(
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<TimeSeriesPayload> {
    const groups = await this.prisma.income.groupBy({
      by: ['date'],
      where: {
        shopId,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      orderBy: { date: 'asc' },
    });

    return this.buildSeriesFromGroups(
      groups.map((group) => ({ date: group.date, amount: group._sum.amount ?? 0 })),
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private async buildExpensesSeries(
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<TimeSeriesPayload> {
    const groups = await this.prisma.expense.groupBy({
      by: ['date'],
      where: {
        shopId,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      orderBy: { date: 'asc' },
    });

    return this.buildSeriesFromGroups(
      groups.map((group) => ({ date: group.date, amount: group._sum.amount ?? 0 })),
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private async buildTopProducts(
    shopId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TopProductResult[]> {
    // Prisma groupBy on shopProductId to rank by quantity + revenue.
    const groups = await this.prisma.saleItem.groupBy({
      by: ['shopProductId'],
      where: {
        sale: {
          shopId,
          status: 'COMPLETED',
          saleDate: { gte: startDate, lte: endDate },
        },
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    if (groups.length === 0) {
      return [];
    }

    const products = await this.prisma.shopProduct.findMany({
      where: { id: { in: groups.map((entry) => entry.shopProductId) } },
      include: { product: true },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    return groups.map((entry) => {
      const shopProduct = productMap.get(entry.shopProductId);
      return {
        shopProductId: entry.shopProductId,
        productId: shopProduct?.productId ?? null,
        productName: shopProduct?.product.name ?? null,
        quantity: entry._sum.quantity ?? 0,
        total: entry._sum.total ?? 0,
      };
    });
  }

  private buildSeriesFromGroups(
    entries: { date: Date; amount: number }[],
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): TimeSeriesPayload {
    const bucketMap = new Map<string, number>();

    for (const entry of entries) {
      const normalizedDate = this.truncateToBucket(entry.date, bucketUnit);
      const label = this.formatLabel(normalizedDate, bucketUnit);
      bucketMap.set(label, (bucketMap.get(label) ?? 0) + entry.amount);
    }

    return this.buildSeriesFromBucketMap(bucketMap, startDate, endDate, bucketUnit);
  }

  private buildEmptySeries(
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): TimeSeriesPayload {
    return this.buildSeriesFromBucketMap(new Map(), startDate, endDate, bucketUnit);
  }

  private buildSeriesFromBucketMap(
    bucketMap: Map<string, number>,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): TimeSeriesPayload {
    const series: SeriesPoint[] = [];
    const cursorEnd = this.truncateToBucket(endDate, bucketUnit);
    let cursor = this.truncateToBucket(startDate, bucketUnit);

    while (cursor <= cursorEnd) {
      const label = this.formatLabel(cursor, bucketUnit);
      series.push({ label, value: bucketMap.get(label) ?? 0 });
      cursor = this.incrementCursor(cursor, bucketUnit);
    }

    const total = series.reduce((sum, point) => sum + point.value, 0);
    return { series, total };
  }

  private formatLabel(date: Date, bucketUnit: BucketUnit) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    if (bucketUnit === 'month') {
      return `${year}-${month}`;
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private truncateToBucket(date: Date, bucketUnit: BucketUnit) {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);

    if (bucketUnit === 'month') {
      normalized.setUTCDate(1);
    }

    return normalized;
  }

  private incrementCursor(date: Date, bucketUnit: BucketUnit) {
    const next = new Date(date);

    if (bucketUnit === 'month') {
      next.setUTCMonth(next.getUTCMonth() + 1);
      next.setUTCDate(1);
      next.setUTCHours(0, 0, 0, 0);
      return next;
    }

    next.setUTCDate(next.getUTCDate() + 1);
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }

  private startOfDay(date: Date) {
    const next = new Date(date);
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }

  private endOfDay(date: Date) {
    const end = this.startOfDay(date);
    end.setUTCDate(end.getUTCDate() + 1);
    end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);
    return end;
  }

  private startOfMonth(date: Date) {
    const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }

  private endOfMonth(date: Date) {
    const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
    next.setUTCHours(0, 0, 0, 0);
    next.setUTCMilliseconds(next.getUTCMilliseconds() - 1);
    return next;
  }

  private startOfYear(date: Date) {
    const next = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }

  private endOfYear(date: Date) {
    const next = new Date(Date.UTC(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
    return next;
  }
}
