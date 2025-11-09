import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthClientModule } from './auth-client/auth-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShopModule } from './shop/shop.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthClientModule, ShopModule, PrismaModule, EmployeeModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
