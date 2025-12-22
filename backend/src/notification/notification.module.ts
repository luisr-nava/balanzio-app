import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationsGateway } from './notification.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config/envs';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: envs.jwtSecret,
    }),
  ],
  providers: [NotificationService, NotificationsGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
