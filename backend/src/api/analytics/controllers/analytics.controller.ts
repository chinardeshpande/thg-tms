import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';
import { AnalyticsFilterDto } from '../dto/analytics-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard metrics',
    description:
      'Returns overall metrics including total shipments, delivery rates, and revenue',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'regions',
    required: false,
    type: [String],
    description: 'Comma-separated list of regions',
  })
  @ApiQuery({
    name: 'carriers',
    required: false,
    type: [String],
    description: 'Comma-separated list of carrier IDs',
  })
  @ApiQuery({
    name: 'shipmentTypes',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment types',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment statuses',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
  })
  getDashboardMetrics(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getDashboardMetrics(filters);
  }

  @Get('shipments')
  @ApiOperation({
    summary: 'Get shipment analytics',
    description:
      'Returns shipment metrics by type, priority, service level, and geographic distribution',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'regions',
    required: false,
    type: [String],
    description: 'Comma-separated list of regions',
  })
  @ApiQuery({
    name: 'carriers',
    required: false,
    type: [String],
    description: 'Comma-separated list of carrier IDs',
  })
  @ApiQuery({
    name: 'shipmentTypes',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment types',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment statuses',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment analytics retrieved successfully',
  })
  getShipmentMetrics(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getShipmentMetrics(filters);
  }

  @Get('carriers')
  @ApiOperation({
    summary: 'Get carrier performance analytics',
    description:
      'Returns performance metrics for each carrier including on-time delivery rates and costs',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'regions',
    required: false,
    type: [String],
    description: 'Comma-separated list of regions',
  })
  @ApiQuery({
    name: 'carriers',
    required: false,
    type: [String],
    description: 'Comma-separated list of carrier IDs',
  })
  @ApiQuery({
    name: 'shipmentTypes',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment types',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment statuses',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrier performance analytics retrieved successfully',
  })
  getCarrierPerformance(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getCarrierPerformance(filters);
  }

  @Get('costs')
  @ApiOperation({
    summary: 'Get cost analytics',
    description:
      'Returns cost metrics including total costs, averages, and breakdowns by type and service level',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'regions',
    required: false,
    type: [String],
    description: 'Comma-separated list of regions',
  })
  @ApiQuery({
    name: 'carriers',
    required: false,
    type: [String],
    description: 'Comma-separated list of carrier IDs',
  })
  @ApiQuery({
    name: 'shipmentTypes',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment types',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment statuses',
  })
  @ApiResponse({
    status: 200,
    description: 'Cost analytics retrieved successfully',
  })
  getCostMetrics(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getCostMetrics(filters);
  }

  @Get('sla')
  @ApiOperation({
    summary: 'Get SLA (Service Level Agreement) analytics',
    description:
      'Returns SLA metrics including on-time delivery rates by type and priority',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'regions',
    required: false,
    type: [String],
    description: 'Comma-separated list of regions',
  })
  @ApiQuery({
    name: 'carriers',
    required: false,
    type: [String],
    description: 'Comma-separated list of carrier IDs',
  })
  @ApiQuery({
    name: 'shipmentTypes',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment types',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    type: [String],
    description: 'Comma-separated list of shipment statuses',
  })
  @ApiResponse({
    status: 200,
    description: 'SLA analytics retrieved successfully',
  })
  getSLAMetrics(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getSLAMetrics(filters);
  }
}
