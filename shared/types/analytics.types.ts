export interface DashboardMetrics {
  shipments: ShipmentMetrics;
  carriers: CarrierPerformance[];
  routes: RouteMetrics;
  costs: CostMetrics;
  sla: SLAMetrics;
}

export interface ShipmentMetrics {
  total: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  failed: number;
  avgDeliveryTime: number;
  onTimeDeliveryRate: number;
  period: string;
}

export interface CarrierPerformance {
  carrierId: string;
  carrierName: string;
  totalShipments: number;
  onTimeDeliveryRate: number;
  avgDeliveryTime: number;
  damageLossRate: number;
  costPerShipment: number;
  customerSatisfactionScore: number;
}

export interface RouteMetrics {
  totalRoutes: number;
  completedRoutes: number;
  inProgressRoutes: number;
  avgStopsPerRoute: number;
  avgDistancePerRoute: number;
  routeCompletionRate: number;
  fuelEfficiency: number;
}

export interface CostMetrics {
  totalFreightCost: number;
  avgCostPerShipment: number;
  avgCostPerKm: number;
  costByCarrier: CarrierCost[];
  costByRegion: RegionCost[];
  costTrend: CostTrend[];
}

export interface CarrierCost {
  carrierId: string;
  carrierName: string;
  totalCost: number;
  shipmentCount: number;
  avgCost: number;
}

export interface RegionCost {
  region: string;
  totalCost: number;
  shipmentCount: number;
  avgCost: number;
}

export interface CostTrend {
  date: string;
  cost: number;
  shipments: number;
}

export interface SLAMetrics {
  onTimeDeliveryRate: number;
  avgDeliveryTime: number;
  targetDeliveryTime: number;
  slaCompliance: number;
  breaches: SLABreach[];
  performanceByRegion: RegionPerformance[];
}

export interface SLABreach {
  shipmentId: string;
  referenceNumber: string;
  plannedDeliveryDate: Date;
  actualDeliveryDate: Date;
  delayHours: number;
  reason?: string;
}

export interface RegionPerformance {
  region: string;
  onTimeRate: number;
  avgDeliveryTime: number;
  totalShipments: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  category?: string;
}

export interface AnalyticsFilter {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  regions?: string[];
  carriers?: string[];
  shipmentTypes?: string[];
  statuses?: string[];
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  filters: AnalyticsFilter;
  generatedAt?: Date;
  generatedBy?: string;
  fileUrl?: string;
  expiresAt?: Date;
}

export enum ReportType {
  SHIPMENT_SUMMARY = 'SHIPMENT_SUMMARY',
  CARRIER_PERFORMANCE = 'CARRIER_PERFORMANCE',
  COST_ANALYSIS = 'COST_ANALYSIS',
  SLA_COMPLIANCE = 'SLA_COMPLIANCE',
  ROUTE_EFFICIENCY = 'ROUTE_EFFICIENCY',
  CUSTOM = 'CUSTOM',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
