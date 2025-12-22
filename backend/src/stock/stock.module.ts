import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
