import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto, AnalyticsType } from './dto/analytics-query.dto';
import {
  BucketUnit,
  endOfMonth,
  endOfWeek,
  endOfYear,
  resolveAnalyticsPeriodRange,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from './helpers/analytics-period.helper';
import type {
  AnalyticsResponse,
  BestSaleSummary,
  Metric,
  TopProductSummary,
} from './interfaces/analytics-response.interface';

type SeriesPoint = { label: string; value: number };
type MetricModule = 'sales' | 'purchases' | 'incomes' | 'expenses';

export type TopProductResult = {
  shopProductId: string;
  productId: string | null;
  name: string | null;
  quantitySold: number;
  totalAmount: number;
};

export type DashboardPeriodKey = 'week' | 'month' | 'year';
type DashboardPeriodDefinition = {
  startDate: Date;
  endDate: Date;
  bucketUnit: BucketUnit;
};
const DASHBOARD_PERIOD_KEYS: DashboardPeriodKey[] = ['week', 'month', 'year'];
type DashboardPeriods = Record<DashboardPeriodKey, DashboardPeriodDefinition>;
type TimeSeriesModule = MetricModule;
const METRIC_MODULES_BY_TYPE: Record<AnalyticsType, MetricModule[]> = {
  [AnalyticsType.ALL]: ['sales', 'purchases', 'incomes', 'expenses'],
  [AnalyticsType.SALES]: ['sales'],
  [AnalyticsType.PURCHASES]: ['purchases'],
  [AnalyticsType.INCOMES]: ['incomes'],
  [AnalyticsType.EXPENSES]: ['expenses'],
};
export type PerformedBy = {
  id: string;
  fullName: string | null;
  role: 'OWNER' | 'EMPLOYEE';
};
export type BestSaleResult = {
  saleId: string;
  total: number;
  date: Date;
  performedBy: PerformedBy;
};
export type DashboardAnalyticsResult = {
  sales: Record<DashboardPeriodKey, Metric>;
  purchases: Record<DashboardPeriodKey, Metric>;
  incomes: Record<DashboardPeriodKey, Metric>;
  expenses: Record<DashboardPeriodKey, Metric>;
  topProducts: TopProductResult[];
  bestSale: BestSaleResult | null;
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(
    query: AnalyticsQueryDto,
    user: JwtPayload,
  ): Promise<AnalyticsResponse> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: query.shopId },
      select: { id: true, projectId: true, timezone: true, ownerId: true },
    });

    if (!shop) {
      throw new BadRequestException('La tienda no existe');
    }

    await this.ensureShopAccess(shop.id, shop.projectId, user);

    const periodRange = resolveAnalyticsPeriodRange(
      query,
      shop.timezone ?? 'UTC',
    );
    const modules = this.getModulesForType(query.type);

    const metrics = await this.buildMetricsForModules(
      modules,
      shop.id,
      periodRange.startDate,
      periodRange.endDate,
      periodRange.bucketUnit,
    );

    const [topProducts, bestSale] = await Promise.all([
      this.buildTopProducts(
        shop.id,
        periodRange.startDate,
        periodRange.endDate,
      ),
      this.buildBestSaleForPeriod(
        shop.id,
        periodRange.startDate,
        periodRange.endDate,
        user,
        shop.ownerId,
      ),
    ]);

    const summaryTopProducts: TopProductSummary[] = topProducts.map(
      (entry) => ({
        productId: entry.productId,
        name: entry.name,
        quantity: entry.quantitySold,
        totalAmount: entry.totalAmount,
      }),
    );

    return {
      period: periodRange.period,
      range: periodRange.range,
      metrics,
      insights: {
        topProducts: summaryTopProducts,
        bestSale,
      },
    };
  }

  private getModulesForType(type?: AnalyticsType): MetricModule[] {
    return METRIC_MODULES_BY_TYPE[type ?? AnalyticsType.ALL];
  }

  private async buildMetricsForModules(
    modules: MetricModule[],
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<AnalyticsResponse['metrics']> {
    const entries = await Promise.all(
      modules.map(async (module) => {
        const metric = await this.buildSeriesForModule(
          module,
          shopId,
          startDate,
          endDate,
          bucketUnit,
        );
        return [module, metric] as const;
      }),
    );

    return Object.fromEntries(entries) as AnalyticsResponse['metrics'];
  }

  async getShopDashboardAnalytics(
    shopId: string,
    timezone = 'UTC',
    ownerId?: string,
    ownerFullName?: string | null,
  ): Promise<DashboardAnalyticsResult> {
    const periods = this.getDashboardPeriods(timezone);

    const [sales, purchases, incomes, expenses, topProducts, bestSale] =
      await Promise.all([
        this.buildModuleDashboardSeries('sales', shopId, periods),
        this.buildModuleDashboardSeries('purchases', shopId, periods),
        this.buildModuleDashboardSeries('incomes', shopId, periods),
        this.buildModuleDashboardSeries('expenses', shopId, periods),
        this.buildTopProducts(shopId),
        this.buildBestSale(shopId, ownerId, ownerFullName),
      ]);

    return {
      sales,
      purchases,
      incomes,
      expenses,
      topProducts,
      bestSale,
    };
  }

  private getDashboardPeriods(
    timezone: string,
    reference = new Date(),
  ): DashboardPeriods {
    const weekStart = startOfWeek(reference, timezone);
    const weekEnd = endOfWeek(reference, timezone);
    const monthStart = startOfMonth(reference, timezone);
    const monthEnd = endOfMonth(reference, timezone);
    const yearStart = startOfYear(reference, timezone);
    const yearEnd = endOfYear(reference, timezone);

    return {
      week: {
        startDate: weekStart,
        endDate: weekEnd,
        bucketUnit: 'day',
      },
      month: {
        startDate: monthStart,
        endDate: monthEnd,
        bucketUnit: 'day',
      },
      year: {
        startDate: yearStart,
        endDate: yearEnd,
        bucketUnit: 'month',
      },
    };
  }

  private async buildModuleDashboardSeries(
    module: TimeSeriesModule,
    shopId: string,
    periods: DashboardPeriods,
  ): Promise<Record<DashboardPeriodKey, Metric>> {
    const results = {} as Record<DashboardPeriodKey, Metric>;

    await Promise.all(
      DASHBOARD_PERIOD_KEYS.map(async (key) => {
        const period = periods[key];
        results[key] = await this.buildSeriesForModule(
          module,
          shopId,
          period.startDate,
          period.endDate,
          period.bucketUnit,
        );
      }),
    );

    return results;
  }

  private async buildSeriesForModule(
    module: TimeSeriesModule,
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<Metric> {
    switch (module) {
      case 'sales':
        return this.buildSalesSeries(shopId, startDate, endDate, bucketUnit);
      case 'purchases':
        return this.buildPurchasesSeries(
          shopId,
          startDate,
          endDate,
          bucketUnit,
        );
      case 'incomes':
        return this.buildIncomesSeries(shopId, startDate, endDate, bucketUnit);
      case 'expenses':
        return this.buildExpensesSeries(shopId, startDate, endDate, bucketUnit);
    }
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

  private async buildSalesSeries(
    shopId: string,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Promise<Metric> {
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
      groups.map((group) => ({
        date: group.saleDate,
        amount: group._sum.totalAmount ?? 0,
      })),
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
  ): Promise<Metric> {
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
      groups.map((group) => ({
        date: group.purchaseDate,
        amount: group._sum.totalAmount ?? 0,
      })),
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
  ): Promise<Metric> {
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
      groups.map((group) => ({
        date: group.date,
        amount: group._sum.amount ?? 0,
      })),
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
  ): Promise<Metric> {
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
      groups.map((group) => ({
        date: group.date,
        amount: group._sum.amount ?? 0,
      })),
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private async buildTopProducts(
    shopId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TopProductResult[]> {
    // Prisma groupBy on shopProductId to rank by quantity + revenue.
    const saleDateFilter =
      startDate && endDate
        ? { gte: startDate, lte: endDate }
        : startDate
          ? { gte: startDate }
          : endDate
            ? { lte: endDate }
            : undefined;
    const saleWhere: Prisma.SaleWhereInput = {
      shopId,
      status: 'COMPLETED',
      ...(saleDateFilter ? { saleDate: saleDateFilter } : {}),
    };

    const groups = await this.prisma.saleItem.groupBy({
      by: ['shopProductId'],
      where: {
        sale: saleWhere,
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

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    return groups.map((entry) => {
      const shopProduct = productMap.get(entry.shopProductId);
      return {
        shopProductId: entry.shopProductId,
        productId: shopProduct?.productId ?? null,
        name: shopProduct?.product.name ?? null,
        quantitySold: Number(entry._sum.quantity ?? 0),
        totalAmount: entry._sum.total ?? 0,
      };
    });
  }

  private async buildBestSaleForPeriod(
    shopId: string,
    startDate: Date,
    endDate: Date,
    user: JwtPayload,
    ownerId?: string,
  ): Promise<BestSaleSummary | null> {
    const sale = await this.prisma.sale.findFirst({
      where: {
        shopId,
        status: 'COMPLETED',
        saleDate: { gte: startDate, lte: endDate },
      },
      orderBy: { totalAmount: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        saleDate: true,
        employee: { select: { fullName: true } },
        _count: { select: { items: true } },
      },
    });

    if (!sale) {
      return null;
    }

    let ownerFullName: string | null = null;

    if (!sale.employee && ownerId) {
      ownerFullName =
        (
          await this.prisma.employee.findUnique({
            where: { id: ownerId },
            select: { fullName: true },
          })
        )?.fullName ?? null;
    }

    return {
      saleId: sale.id,
      date: sale.saleDate.toISOString(),
      total: sale.totalAmount,
      itemsCount: sale._count.items ?? 0,
      name: sale.employee?.fullName ?? ownerFullName ?? user.fullName ?? null,
    };
  }

  private async buildBestSale(
    shopId: string,
    ownerId?: string,
    ownerFullName?: string | null,
  ): Promise<BestSaleResult | null> {
    const sale = await this.prisma.sale.findFirst({
      where: { shopId, status: 'COMPLETED' },
      orderBy: { totalAmount: 'desc' },
      select: { id: true, totalAmount: true, saleDate: true, employeeId: true },
    });

    if (!sale) {
      return null;
    }

    const performedBy: PerformedBy =
      sale.employeeId !== null && sale.employeeId !== undefined
        ? {
            id: sale.employeeId,
            fullName:
              (
                await this.prisma.employee.findUnique({
                  where: { id: sale.employeeId },
                  select: { fullName: true },
                })
              )?.fullName ?? null,
            role: 'EMPLOYEE',
          }
        : {
            id: ownerId ?? sale.employeeId ?? 'OWNER',
            fullName: ownerFullName ?? null,
            role: 'OWNER',
          };

    return {
      saleId: sale.id,
      total: sale.totalAmount,
      date: sale.saleDate,
      performedBy,
    };
  }

  private buildSeriesFromGroups(
    entries: { date: Date; amount: number }[],
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Metric {
    const bucketMap = new Map<string, number>();

    for (const entry of entries) {
      const normalizedDate = this.truncateToBucket(entry.date, bucketUnit);
      const label = this.formatLabel(normalizedDate, bucketUnit);
      bucketMap.set(label, (bucketMap.get(label) ?? 0) + entry.amount);
    }

    return this.buildSeriesFromBucketMap(
      bucketMap,
      startDate,
      endDate,
      bucketUnit,
    );
  }

  private buildSeriesFromBucketMap(
    bucketMap: Map<string, number>,
    startDate: Date,
    endDate: Date,
    bucketUnit: BucketUnit,
  ): Metric {
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
}
