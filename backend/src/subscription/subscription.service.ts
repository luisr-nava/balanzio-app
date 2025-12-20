import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionForProject(projectId: string) {
    if (!projectId) {
      return null;
    }

    return this.prisma.subscription.findUnique({ where: { projectId } });
  }
}
