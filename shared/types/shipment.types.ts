import { Address } from './user.types';

export enum ShipmentType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  RETURN = 'RETURN',
  STOCK_TRANSFER = 'STOCK_TRANSFER',
}

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum ShipmentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ServiceLevel {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
  NEXT_DAY = 'NEXT_DAY',
  TWO_DAY = 'TWO_DAY',
}

export interface Shipment {
  id: string;
  referenceNumber: string;
  type: ShipmentType;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  serviceLevel: ServiceLevel;

  // Origin & Destination
  originAddress: Address;
  destinationAddress: Address;
  originWarehouseId?: string;
  destinationWarehouseId?: string;

  // Carrier Information
  carrierId?: string;
  carrierName?: string;
  carrierServiceCode?: string;
  trackingNumber?: string;

  // Package Information
  packages: Package[];
  totalWeight: number;
  totalVolume: number;
  weightUnit: WeightUnit;
  dimensionUnit: DimensionUnit;

  // Dates
  createdAt: Date;
  updatedAt: Date;
  scheduledPickupDate?: Date;
  actualPickupDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;

  // Customer Information
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;

  // Financial
  declaredValue?: number;
  currency: string;
  freightCost?: number;
  insuranceCost?: number;
  totalCost?: number;

  // Additional Information
  specialInstructions?: string;
  requiresSignature: boolean;
  isHazmat: boolean;
  isFragile: boolean;
  isTemperatureControlled: boolean;
  temperatureRange?: TemperatureRange;

  // Documents
  documents: ShipmentDocument[];

  // Metadata
  metadata?: Record<string, any>;
}

export interface Package {
  id: string;
  shipmentId: string;
  packageNumber: number;
  trackingNumber?: string;

  // Dimensions
  length: number;
  width: number;
  height: number;
  weight: number;

  // Contents
  items: PackageItem[];
  description: string;

  // Labels
  labelUrl?: string;
  labelFormat?: LabelFormat;

  createdAt: Date;
  updatedAt: Date;
}

export interface PackageItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice?: number;
  weight?: number;
  hsCode?: string;
  countryOfOrigin?: string;
}

export interface ShipmentDocument {
  id: string;
  shipmentId: string;
  type: DocumentType;
  name: string;
  url: string;
  format: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export enum DocumentType {
  LABEL = 'LABEL',
  BOL = 'BOL',
  ASN = 'ASN',
  INVOICE = 'INVOICE',
  PACKING_LIST = 'PACKING_LIST',
  CUSTOMS_DECLARATION = 'CUSTOMS_DECLARATION',
  EXPORT_DECLARATION = 'EXPORT_DECLARATION',
  CERTIFICATE_OF_ORIGIN = 'CERTIFICATE_OF_ORIGIN',
  OTHER = 'OTHER',
}

export enum LabelFormat {
  PDF = 'PDF',
  ZPL = 'ZPL',
  PNG = 'PNG',
  JPEG = 'JPEG',
}

export enum WeightUnit {
  KG = 'KG',
  LB = 'LB',
  G = 'G',
  OZ = 'OZ',
}

export enum DimensionUnit {
  CM = 'CM',
  IN = 'IN',
  M = 'M',
  FT = 'FT',
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: TemperatureUnit;
}

export enum TemperatureUnit {
  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
}

export interface ShipmentTracking {
  id: string;
  shipmentId: string;
  packageId?: string;
  status: ShipmentStatus;
  location: TrackingLocation;
  description: string;
  timestamp: Date;
  createdBy?: string;
  metadata?: Record<string, any>;
}

export interface TrackingLocation {
  address?: Address;
  latitude?: number;
  longitude?: number;
  facility?: string;
  facilityType?: FacilityType;
}

export enum FacilityType {
  WAREHOUSE = 'WAREHOUSE',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  SORTING_CENTER = 'SORTING_CENTER',
  DELIVERY_STATION = 'DELIVERY_STATION',
  CUSTOMER_LOCATION = 'CUSTOMER_LOCATION',
}
