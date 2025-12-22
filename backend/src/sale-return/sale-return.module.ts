import { Module } from '@nestjs/common';
import { SaleReturnService } from './sale-return.service';
import { SaleReturnController } from './sale-return.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CashRegisterModule } from '../cash-register/cash-register.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [PrismaModule, CashRegisterModule, StockModule],
  controllers: [SaleReturnController],
  providers: [SaleReturnService],
  exports: [SaleReturnService],
})
export class SaleReturnModule {}
