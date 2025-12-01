import { Module } from '@nestjs/common';
import { RoutesController } from './controllers/routes.controller';
import { RoutesService } from './services/routes.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, PrismaService],
  exports: [RoutesService],
})
export class RoutesModule {}
