import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { CashMovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth-client/interfaces/jwt-payload.interface';

type CashRegisterWithRelations = Prisma.CashRegisterGetPayload<{
  include: {
    shop: {
      select: {
        id: true;
        name: true;
        ownerId: true;
        projectId: true;
        currencyCode: true;
      };
    };
    movements: {
      orderBy: { createdAt: 'asc' };
      include: {
        sale: {
          select: {
            id: true;
            invoiceNumber: true;
            invoiceType: true;
            customer: { select: { fullName: true } };
          };
        };
        purchase: {
          select: {
            id: true;
            supplier: { select: { name: true } };
            paymentMethod: { select: { name: true; code: true } };
          };
        };
        saleReturn: {
          select: {
            id: true;
            reason: true;
            refundAmount: true;
          };
        };
        income: {
          select: {
            id: true;
            description: true;
            paymentMethod: { select: { name: true; code: true } };
          };
        };
        expense: {
          select: {
            id: true;
            description: true;
            paymentMethod: { select: { name: true; code: true } };
          };
        };
      };
    };
  };
}>;

type EmployeeSummary = {
  id: string;
  fullName: string;
  email: string | null;
  role: string;
};

export type MovementTotals = {
  sales: number;
  incomes: number;
  purchases: number;
  expenses: number;
  returns: number;
  withdrawals: number;
  deposits: number;
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  expectedAmount: number;
};

export type CashRegisterExportContext = {
  cashRegister: CashRegisterWithRelations;
  employee: EmployeeSummary | null;
  totals: MovementTotals;
  differenceStatus: 'EXACTO' | 'SOBRANTE' | 'FALTANTE';
  closingType: 'MANUAL' | 'AUTOMÁTICO';
  userMap: Map<string, { fullName: string; email?: string | null }>;
};

@Injectable()
export class CashRegisterExportDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getClosedCashRegisterContext(
    cashRegisterId: string,
    user: JwtPayload,
  ): Promise<CashRegisterExportContext> {
    const cashRegister = await this.prisma.cashRegister.findUnique({
      where: { id: cashRegisterId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            projectId: true,
            currencyCode: true,
          },
        },
        movements: {
          orderBy: { createdAt: 'asc' },
          include: {
            sale: {
              select: {
                id: true,
                invoiceNumber: true,
                invoiceType: true,
                customer: { select: { fullName: true } },
              },
            },
            purchase: {
              select: {
                id: true,
                supplier: { select: { name: true } },
                paymentMethod: { select: { name: true, code: true } },
              },
            },
            saleReturn: {
              select: {
                id: true,
                reason: true,
                refundAmount: true,
              },
            },
            income: {
              select: {
                id: true,
                description: true,
                paymentMethod: { select: { name: true, code: true } },
              },
            },
            expense: {
              select: {
                id: true,
                description: true,
                paymentMethod: { select: { name: true, code: true } },
              },
            },
          },
        },
      },
    });

    if (!cashRegister) {
      throw new NotFoundException('Caja no encontrada');
    }

    await this.validateAccess(cashRegister, user);

    if (cashRegister.status !== 'CLOSED') {
      throw new ConflictException('La caja debe estar cerrada para exportar');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: cashRegister.employeeId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    const totals = this.calculateTotalsFromMovements(
      cashRegister.openingAmount,
      cashRegister.movements,
    );

    const difference = cashRegister.difference ?? 0;
    const differenceStatus =
      difference > 0 ? 'SOBRANTE' : difference < 0 ? 'FALTANTE' : 'EXACTO';

    const closingNotes = cashRegister.closingNotes?.toLowerCase() ?? '';
    const isAutomatic =
      closingNotes.includes('automático') || closingNotes.includes('automatico');
    const closingType = isAutomatic ? 'AUTOMÁTICO' : 'MANUAL';

    const userMap = await this.buildUserMap(cashRegister);

    return {
      cashRegister,
      employee: employee ?? null,
      totals,
      differenceStatus,
      closingType,
      userMap,
    };
  }

  private async validateAccess(
    cashRegister: CashRegisterWithRelations,
    user: JwtPayload,
  ) {
    const shop = cashRegister.shop;

    if (shop.projectId !== user.projectId) {
      throw new ForbiddenException('No tienes acceso a esta tienda');
    }

    if (user.role === 'OWNER' && shop.ownerId !== user.id) {
      throw new ForbiddenException('No tienes acceso a esta tienda');
    }

    if (user.role === 'EMPLOYEE') {
      const employee = await this.prisma.employee.findFirst({
        where: { id: user.id, employeeShops: { some: { shopId: shop.id } } },
      });

      if (!employee) {
        throw new ForbiddenException('No tienes permiso para esta tienda');
      }

      if (cashRegister.employeeId !== user.id) {
        throw new ForbiddenException('No tienes permiso para acceder a esta caja');
      }
    }
  }

  private calculateTotalsFromMovements(
    openingAmount: number,
    movements: Array<{ type: CashMovementType; amount: number }>,
  ): MovementTotals {
    const totals: Omit<MovementTotals, 'expectedAmount'> = {
      sales: 0,
      incomes: 0,
      purchases: 0,
      expenses: 0,
      returns: 0,
      withdrawals: 0,
      deposits: 0,
      totalIncome: 0,
      totalExpense: 0,
      netIncome: 0,
    };

    const totalMovements = movements.reduce((sum, mov) => {
      switch (mov.type) {
        case CashMovementType.SALE:
          totals.sales += mov.amount;
          return sum + mov.amount;
        case CashMovementType.INCOME:
          totals.incomes += mov.amount;
          return sum + mov.amount;
        case CashMovementType.DEPOSIT:
          totals.deposits += mov.amount;
          return sum + mov.amount;
        case CashMovementType.PURCHASE:
          totals.purchases += mov.amount;
          return sum - mov.amount;
        case CashMovementType.RETURN:
          totals.returns += mov.amount;
          return sum - mov.amount;
        case CashMovementType.EXPENSE:
          totals.expenses += mov.amount;
          return sum - mov.amount;
        case CashMovementType.WITHDRAWAL:
          totals.withdrawals += mov.amount;
          return sum - mov.amount;
        default:
          return sum;
      }
    }, 0);

    totals.totalIncome = totals.sales + totals.incomes + totals.deposits;
    totals.totalExpense =
      totals.purchases + totals.expenses + totals.returns + totals.withdrawals;
    totals.netIncome = totals.totalIncome - totals.totalExpense;

    const expectedAmount = openingAmount + totalMovements;

    return { ...totals, expectedAmount };
  }

  private async buildUserMap(cashRegister: CashRegisterWithRelations) {
    const userIds = new Set<string>([
      cashRegister.employeeId,
      ...(cashRegister.closedBy ? [cashRegister.closedBy] : []),
    ]);

    cashRegister.movements.forEach((movement) => {
      userIds.add(movement.userId);
    });

    const employees = await this.prisma.employee.findMany({
      where: { id: { in: Array.from(userIds) } },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    const map = new Map<string, { fullName: string; email?: string | null }>();

    employees.forEach((employee) => {
      map.set(employee.id, {
        fullName: employee.fullName,
        email: employee.email,
      });
    });

    return map;
  }
}
