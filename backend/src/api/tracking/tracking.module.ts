import { Module } from '@nestjs/common';
import { TrackingController } from './controllers/tracking.controller';
import { TrackingService } from './services/tracking.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [TrackingController],
  providers: [TrackingService, PrismaService],
  exports: [TrackingService],
})
export class TrackingModule {}
