import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { AnalyticsFilterDto } from '../dto/analytics-filter.dto';
import { ShipmentStatus, ShipmentType } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private buildWhereClause(filters: AnalyticsFilterDto) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    if (filters.regions && filters.regions.length > 0) {
      where.OR = [
        { originCountry: { in: filters.regions } },
        { destCountry: { in: filters.regions } },
      ];
    }

    if (filters.carriers && filters.carriers.length > 0) {
      where.carrierId = { in: filters.carriers };
    }

    if (filters.shipmentTypes && filters.shipmentTypes.length > 0) {
      where.type = { in: filters.shipmentTypes };
    }

    if (filters.statuses && filters.statuses.length > 0) {
      where.status = { in: filters.statuses };
    }

    if (filters.customers && filters.customers.length > 0) {
      where.customerId = { in: filters.customers };
    }

    return where;
  }

  async getDashboardMetrics(filters?: AnalyticsFilterDto) {
    const where = filters ? this.buildWhereClause(filters) : {};

    // Get total shipments
    const totalShipments = await this.prisma.shipment.count({ where });

    // Get shipments by status
    const shipmentsByStatus = await this.prisma.shipment.groupBy({
      by: ['status'],
      where,
      _count: {
        id: true,
      },
    });

    // Get active shipments (in transit or pending)
    const activeShipments = await this.prisma.shipment.count({
      where: {
        ...where,
        status: {
          in: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'CONFIRMED', 'PENDING'],
        },
      },
    });

    // Get delivered shipments
    const deliveredShipments = await this.prisma.shipment.count({
      where: {
        ...where,
        status: 'DELIVERED',
      },
    });

    // Calculate on-time delivery rate
    const deliveredWithDates = await this.prisma.shipment.findMany({
      where: {
        ...where,
        status: 'DELIVERED',
        actualDeliveryDate: { not: null },
        estimatedDeliveryDate: { not: null },
      },
      select: {
        actualDeliveryDate: true,
        estimatedDeliveryDate: true,
      },
    });

    let onTimeDeliveries = 0;
    deliveredWithDates.forEach((shipment) => {
      if (
        shipment.actualDeliveryDate &&
        shipment.estimatedDeliveryDate &&
        shipment.actualDeliveryDate <= shipment.estimatedDeliveryDate
      ) {
        onTimeDeliveries++;
      }
    });

    const onTimeDeliveryRate =
      deliveredWithDates.length > 0
        ? (onTimeDeliveries / deliveredWithDates.length) * 100
        : 0;

    // Get total revenue
    const revenueData = await this.prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        shipment: where,
      },
      _sum: {
        total: true,
      },
    });

    const totalRevenue = revenueData._sum.total || 0;

    // Get pending revenue
    const pendingRevenueData = await this.prisma.invoice.aggregate({
      where: {
        status: 'PENDING',
        shipment: where,
      },
      _sum: {
        total: true,
      },
    });

    const pendingRevenue = pendingRevenueData._sum.total || 0;

    // Get average shipment value
    const avgShipmentValue =
      totalShipments > 0 ? totalRevenue / totalShipments : 0;

    return {
      summary: {
        totalShipments,
        activeShipments,
        deliveredShipments,
        onTimeDeliveryRate: parseFloat(onTimeDeliveryRate.toFixed(2)),
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        pendingRevenue: parseFloat(pendingRevenue.toFixed(2)),
        avgShipmentValue: parseFloat(avgShipmentValue.toFixed(2)),
      },
      shipmentsByStatus: shipmentsByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
        percentage: parseFloat(
          ((item._count.id / totalShipments) * 100).toFixed(2),
        ),
      })),
    };
  }

  async getShipmentMetrics(filters?: AnalyticsFilterDto) {
    const where = filters ? this.buildWhereClause(filters) : {};

    // Shipments by type
    const shipmentsByType = await this.prisma.shipment.groupBy({
      by: ['type'],
      where,
      _count: {
        id: true,
      },
    });

    // Shipments by priority
    const shipmentsByPriority = await this.prisma.shipment.groupBy({
      by: ['priority'],
      where,
      _count: {
        id: true,
      },
    });

    // Shipments by service level
    const shipmentsByServiceLevel = await this.prisma.shipment.groupBy({
      by: ['serviceLevel'],
      where,
      _count: {
        id: true,
      },
    });

    // Average weight and volume
    const avgMetrics = await this.prisma.shipment.aggregate({
      where,
      _avg: {
        totalWeight: true,
        totalVolume: true,
      },
      _sum: {
        totalWeight: true,
        totalVolume: true,
      },
    });

    // Top origin countries
    const topOriginCountries = await this.prisma.shipment.groupBy({
      by: ['originCountry'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Top destination countries
    const topDestCountries = await this.prisma.shipment.groupBy({
      by: ['destCountry'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Shipments over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const shipmentsOverTime = await this.prisma.$queryRaw<
      Array<{ date: Date; count: number }>
    >`
      SELECT
        DATE(created_at) as date,
        COUNT(*)::int as count
      FROM shipments
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `;

    return {
      shipmentsByType: shipmentsByType.map((item) => ({
        type: item.type,
        count: item._count.id,
      })),
      shipmentsByPriority: shipmentsByPriority.map((item) => ({
        priority: item.priority,
        count: item._count.id,
      })),
      shipmentsByServiceLevel: shipmentsByServiceLevel.map((item) => ({
        serviceLevel: item.serviceLevel,
        count: item._count.id,
      })),
      averageMetrics: {
        avgWeight: avgMetrics._avg.totalWeight
          ? parseFloat(avgMetrics._avg.totalWeight.toFixed(2))
          : 0,
        avgVolume: avgMetrics._avg.totalVolume
          ? parseFloat(avgMetrics._avg.totalVolume.toFixed(2))
          : 0,
        totalWeight: avgMetrics._sum.totalWeight
          ? parseFloat(avgMetrics._sum.totalWeight.toFixed(2))
          : 0,
        totalVolume: avgMetrics._sum.totalVolume
          ? parseFloat(avgMetrics._sum.totalVolume.toFixed(2))
          : 0,
      },
      topOriginCountries: topOriginCountries.map((item) => ({
        country: item.originCountry,
        count: item._count.id,
      })),
      topDestCountries: topDestCountries.map((item) => ({
        country: item.destCountry,
        count: item._count.id,
      })),
      shipmentsOverTime: shipmentsOverTime.map((item) => ({
        date: item.date,
        count: item.count,
      })),
    };
  }

  async getCarrierPerformance(filters?: AnalyticsFilterDto) {
    const where = filters ? this.buildWhereClause(filters) : {};

    // Filter to only include shipments with carriers
    where.carrierId = { not: null };

    // Shipments by carrier
    const shipmentsByCarrier = await this.prisma.shipment.groupBy({
      by: ['carrierId'],
      where,
      _count: {
        id: true,
      },
    });

    // Get carrier details and calculate metrics
    const carrierPerformance = await Promise.all(
      shipmentsByCarrier.map(async (item) => {
        if (!item.carrierId) return null;

        const carrier = await this.prisma.carrier.findUnique({
          where: { id: item.carrierId },
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
          },
        });

        // Get delivered shipments for this carrier
        const deliveredShipments = await this.prisma.shipment.findMany({
          where: {
            ...where,
            carrierId: item.carrierId,
            status: 'DELIVERED',
            actualDeliveryDate: { not: null },
            estimatedDeliveryDate: { not: null },
          },
          select: {
            actualDeliveryDate: true,
            estimatedDeliveryDate: true,
          },
        });

        let onTimeDeliveries = 0;
        deliveredShipments.forEach((shipment) => {
          if (
            shipment.actualDeliveryDate &&
            shipment.estimatedDeliveryDate &&
            shipment.actualDeliveryDate <= shipment.estimatedDeliveryDate
          ) {
            onTimeDeliveries++;
          }
        });

        const onTimeRate =
          deliveredShipments.length > 0
            ? (onTimeDeliveries / deliveredShipments.length) * 100
            : 0;

        // Get average cost
        const costData = await this.prisma.shipment.aggregate({
          where: {
            ...where,
            carrierId: item.carrierId,
          },
          _avg: {
            totalCost: true,
          },
        });

        return {
          carrier: carrier || { id: item.carrierId, name: 'Unknown' },
          totalShipments: item._count.id,
          deliveredShipments: deliveredShipments.length,
          onTimeDeliveryRate: parseFloat(onTimeRate.toFixed(2)),
          avgCost: costData._avg.totalCost
            ? parseFloat(costData._avg.totalCost.toFixed(2))
            : 0,
        };
      }),
    );

    return {
      carriers: carrierPerformance.filter((item) => item !== null),
    };
  }

  async getCostMetrics(filters?: AnalyticsFilterDto) {
    const where = filters ? this.buildWhereClause(filters) : {};

    // Total costs
    const costData = await this.prisma.shipment.aggregate({
      where,
      _sum: {
        totalCost: true,
        freightCost: true,
        insuranceCost: true,
      },
      _avg: {
        totalCost: true,
        freightCost: true,
        insuranceCost: true,
      },
    });

    // Invoice statistics
    const invoiceStats = await this.prisma.invoice.groupBy({
      by: ['status'],
      where: {
        shipment: where,
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    // Costs by shipment type
    const costsByType = await this.prisma.shipment.groupBy({
      by: ['type'],
      where,
      _sum: {
        totalCost: true,
      },
      _avg: {
        totalCost: true,
      },
      _count: {
        id: true,
      },
    });

    // Costs by service level
    const costsByServiceLevel = await this.prisma.shipment.groupBy({
      by: ['serviceLevel'],
      where,
      _sum: {
        totalCost: true,
      },
      _avg: {
        totalCost: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalCosts: {
        total: costData._sum.totalCost
          ? parseFloat(costData._sum.totalCost.toFixed(2))
          : 0,
        freight: costData._sum.freightCost
          ? parseFloat(costData._sum.freightCost.toFixed(2))
          : 0,
        insurance: costData._sum.insuranceCost
          ? parseFloat(costData._sum.insuranceCost.toFixed(2))
          : 0,
      },
      averageCosts: {
        total: costData._avg.totalCost
          ? parseFloat(costData._avg.totalCost.toFixed(2))
          : 0,
        freight: costData._avg.freightCost
          ? parseFloat(costData._avg.freightCost.toFixed(2))
          : 0,
        insurance: costData._avg.insuranceCost
          ? parseFloat(costData._avg.insuranceCost.toFixed(2))
          : 0,
      },
      invoiceStats: invoiceStats.map((item) => ({
        status: item.status,
        count: item._count.id,
        total: item._sum.total ? parseFloat(item._sum.total.toFixed(2)) : 0,
      })),
      costsByType: costsByType.map((item) => ({
        type: item.type,
        count: item._count.id,
        totalCost: item._sum.totalCost
          ? parseFloat(item._sum.totalCost.toFixed(2))
          : 0,
        avgCost: item._avg.totalCost
          ? parseFloat(item._avg.totalCost.toFixed(2))
          : 0,
      })),
      costsByServiceLevel: costsByServiceLevel.map((item) => ({
        serviceLevel: item.serviceLevel,
        count: item._count.id,
        totalCost: item._sum.totalCost
          ? parseFloat(item._sum.totalCost.toFixed(2))
          : 0,
        avgCost: item._avg.totalCost
          ? parseFloat(item._avg.totalCost.toFixed(2))
          : 0,
      })),
    };
  }

  async getSLAMetrics(filters?: AnalyticsFilterDto) {
    const where = filters ? this.buildWhereClause(filters) : {};

    // Get all delivered shipments with dates
    const deliveredShipments = await this.prisma.shipment.findMany({
      where: {
        ...where,
        status: 'DELIVERED',
        actualDeliveryDate: { not: null },
        estimatedDeliveryDate: { not: null },
      },
      select: {
        id: true,
        type: true,
        priority: true,
        serviceLevel: true,
        actualDeliveryDate: true,
        estimatedDeliveryDate: true,
        actualPickupDate: true,
        scheduledPickupDate: true,
      },
    });

    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let totalDelayHours = 0;
    let onTimePickups = 0;
    let latePickups = 0;

    deliveredShipments.forEach((shipment) => {
      // Check delivery performance
      if (
        shipment.actualDeliveryDate &&
        shipment.estimatedDeliveryDate
      ) {
        if (shipment.actualDeliveryDate <= shipment.estimatedDeliveryDate) {
          onTimeDeliveries++;
        } else {
          lateDeliveries++;
          const delayMs =
            shipment.actualDeliveryDate.getTime() -
            shipment.estimatedDeliveryDate.getTime();
          totalDelayHours += delayMs / (1000 * 60 * 60);
        }
      }

      // Check pickup performance
      if (shipment.actualPickupDate && shipment.scheduledPickupDate) {
        if (shipment.actualPickupDate <= shipment.scheduledPickupDate) {
          onTimePickups++;
        } else {
          latePickups++;
        }
      }
    });

    const totalShipments = deliveredShipments.length;
    const onTimeDeliveryRate =
      totalShipments > 0 ? (onTimeDeliveries / totalShipments) * 100 : 0;
    const avgDelayHours =
      lateDeliveries > 0 ? totalDelayHours / lateDeliveries : 0;

    // SLA by type
    const slaByType: Record<string, any> = {};
    Object.values(ShipmentType).forEach((type) => {
      const typeShipments = deliveredShipments.filter((s) => s.type === type);
      const typeOnTime = typeShipments.filter(
        (s) =>
          s.actualDeliveryDate &&
          s.estimatedDeliveryDate &&
          s.actualDeliveryDate <= s.estimatedDeliveryDate,
      ).length;

      slaByType[type] = {
        total: typeShipments.length,
        onTime: typeOnTime,
        rate:
          typeShipments.length > 0
            ? parseFloat(((typeOnTime / typeShipments.length) * 100).toFixed(2))
            : 0,
      };
    });

    // SLA by priority
    const slaByPriority: Record<string, any> = {};
    ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].forEach((priority) => {
      const priorityShipments = deliveredShipments.filter(
        (s) => s.priority === priority,
      );
      const priorityOnTime = priorityShipments.filter(
        (s) =>
          s.actualDeliveryDate &&
          s.estimatedDeliveryDate &&
          s.actualDeliveryDate <= s.estimatedDeliveryDate,
      ).length;

      slaByPriority[priority] = {
        total: priorityShipments.length,
        onTime: priorityOnTime,
        rate:
          priorityShipments.length > 0
            ? parseFloat(
                ((priorityOnTime / priorityShipments.length) * 100).toFixed(2),
              )
            : 0,
      };
    });

    return {
      overall: {
        totalDeliveredShipments: totalShipments,
        onTimeDeliveries,
        lateDeliveries,
        onTimeDeliveryRate: parseFloat(onTimeDeliveryRate.toFixed(2)),
        avgDelayHours: parseFloat(avgDelayHours.toFixed(2)),
        onTimePickups,
        latePickups,
      },
      byType: slaByType,
      byPriority: slaByPriority,
    };
  }
}
