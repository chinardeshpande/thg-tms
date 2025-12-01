import { Module } from '@nestjs/common';
import { CarriersController } from './controllers/carriers.controller';
import { CarriersService } from './services/carriers.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [CarriersController],
  providers: [CarriersService, PrismaService],
  exports: [CarriersService],
})
export class CarriersModule {}
