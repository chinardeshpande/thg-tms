export enum CarrierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum CarrierType {
  COURIER = 'COURIER',
  FREIGHT = 'FREIGHT',
  PARCEL = 'PARCEL',
  LTL = 'LTL',
  FTL = 'FTL',
  LAST_MILE = 'LAST_MILE',
}

export interface Carrier {
  id: string;
  code: string;
  name: string;
  type: CarrierType;
  status: CarrierStatus;
  email: string;
  phone: string;
  website?: string;
  apiEndpoint?: string;
  apiKey?: string;

  // Capabilities
  capabilities: CarrierCapability[];
  serviceTypes: CarrierService[];
  supportedRegions: string[];

  // Performance Metrics
  metrics?: CarrierMetrics;

  createdAt: Date;
  updatedAt: Date;
}

export interface CarrierService {
  id: string;
  carrierId: string;
  code: string;
  name: string;
  description?: string;
  serviceLevel: string;
  transitTime: number; // in hours
  cutoffTime?: string;

  // Pricing
  baseRate: number;
  currency: string;

  // Restrictions
  maxWeight?: number;
  maxDimensions?: Dimensions;

  isActive: boolean;
}

export interface CarrierCapability {
  name: string;
  enabled: boolean;
  metadata?: Record<string, any>;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface CarrierMetrics {
  onTimeDeliveryRate: number;
  averageTransitTime: number;
  damageLossRate: number;
  customerSatisfactionScore: number;
  totalShipments: number;
  lastUpdated: Date;
}

export interface CarrierRate {
  id: string;
  carrierId: string;
  serviceId: string;
  originZone: string;
  destinationZone: string;
  weightFrom: number;
  weightTo: number;
  rate: number;
  currency: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
}

export interface CarrierContract {
  id: string;
  carrierId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  minimumVolume?: number;
  discountTier?: number;
  terms: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
}

export interface TenderRequest {
  id: string;
  shipmentId: string;
  carrierId: string;
  status: TenderStatus;
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
  quotedRate?: number;
  currency?: string;
  estimatedPickupDate?: Date;
  estimatedDeliveryDate?: Date;
  notes?: string;
}

export enum TenderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}
