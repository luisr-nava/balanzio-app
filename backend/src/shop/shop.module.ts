import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { CashRegisterModule } from '../cash-register/cash-register.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [CashRegisterModule, PrismaModule, NotificationModule, AnalyticsModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
