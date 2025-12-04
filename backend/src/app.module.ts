import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redisStore from 'cache-manager-redis-store';

// Core services
import { PrismaService } from './services/prisma.service';
import { LoggingInterceptor } from './api/middleware/logging.interceptor';

// Modules
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { CompaniesModule } from './api/companies/companies.module';
import { ShipmentsModule } from './api/shipments/shipments.module';
import { CarriersModule } from './api/carriers/carriers.module';
// import { RoutesModule } from './api/routes/routes.module';
// import { TrackingModule } from './api/tracking/tracking.module';
import { BillingModule } from './api/billing/billing.module';
// import { AnalyticsModule } from './api/analytics/analytics.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Caching
    CacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 300, // 5 minutes default
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event Emitter
    EventEmitterModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    CompaniesModule,
    ShipmentsModule,
    CarriersModule,
    // RoutesModule, // Temporarily disabled - has schema mismatches
    // TrackingModule, // Temporarily disabled - has schema mismatches
    BillingModule,
    // AnalyticsModule, // Temporarily disabled - has schema mismatches
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
