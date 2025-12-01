import { Address, GeoLocation } from './index';

export enum RouteStatus {
  PLANNED = 'PLANNED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  CARGO_VAN = 'CARGO_VAN',
  BOX_TRUCK = 'BOX_TRUCK',
  SEMI_TRUCK = 'SEMI_TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  BICYCLE = 'BICYCLE',
}

export interface Route {
  id: string;
  routeNumber: string;
  status: RouteStatus;

  // Vehicle Assignment
  vehicleId?: string;
  vehicleType: VehicleType;
  driverId?: string;
  driverName?: string;

  // Route Details
  stops: RouteStop[];
  totalDistance: number;
  totalDuration: number;
  distanceUnit: string;

  // Optimization
  isOptimized: boolean;
  optimizedAt?: Date;
  optimizationScore?: number;

  // Scheduling
  plannedStartTime: Date;
  plannedEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;

  // Load Information
  totalWeight: number;
  totalVolume: number;
  totalPackages: number;

  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface RouteStop {
  id: string;
  routeId: string;
  sequenceNumber: number;
  stopType: StopType;

  // Location
  address: Address;
  location: GeoLocation;
  facilityId?: string;

  // Shipment Info
  shipmentIds: string[];
  packageIds: string[];

  // Timing
  plannedArrivalTime: Date;
  plannedDepartureTime: Date;
  actualArrivalTime?: Date;
  actualDepartureTime?: Date;
  serviceTime: number; // in minutes

  // Status
  status: StopStatus;
  completedAt?: Date;
  notes?: string;

  // Contact
  contactName?: string;
  contactPhone?: string;

  metadata?: Record<string, any>;
}

export enum StopType {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
  PICKUP_AND_DELIVERY = 'PICKUP_AND_DELIVERY',
}

export enum StopStatus {
  PENDING = 'PENDING',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: VehicleType;
  licensePlate: string;
  status: VehicleStatus;

  // Specifications
  make: string;
  model: string;
  year: number;
  color?: string;

  // Capacity
  maxWeight: number;
  maxVolume: number;
  maxPallets?: number;

  // Tracking
  gpsDeviceId?: string;
  currentLocation?: GeoLocation;
  lastLocationUpdate?: Date;

  // Assignment
  assignedDriverId?: string;
  assignedRouteId?: string;

  // Maintenance
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  mileage?: number;

  createdAt: Date;
  updatedAt: Date;
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Driver {
  id: string;
  userId: string;
  driverNumber: string;
  licenseNumber: string;
  licenseExpiry: Date;
  status: DriverStatus;

  // Assignment
  assignedVehicleId?: string;
  assignedRouteId?: string;
  currentLocation?: GeoLocation;

  // Performance
  metrics?: DriverMetrics;

  createdAt: Date;
  updatedAt: Date;
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  ON_DUTY = 'ON_DUTY',
  OFF_DUTY = 'OFF_DUTY',
  BREAK = 'BREAK',
  INACTIVE = 'INACTIVE',
}

export interface DriverMetrics {
  totalDeliveries: number;
  onTimeDeliveryRate: number;
  averageRating: number;
  totalMilesDriven: number;
  lastUpdated: Date;
}

export interface RouteOptimizationRequest {
  shipments: string[];
  vehicleTypes: VehicleType[];
  startLocation: GeoLocation;
  endLocation?: GeoLocation;
  maxRoutes?: number;
  maxStopsPerRoute?: number;
  timeWindows?: boolean;
  constraints?: RouteConstraints;
}

export interface RouteConstraints {
  maxRouteDistance?: number;
  maxRouteDuration?: number;
  maxVehicleWeight?: number;
  maxVehicleVolume?: number;
  driverShiftHours?: number;
  breakDuration?: number;
}

export interface RouteOptimizationResult {
  routes: Route[];
  unassignedShipments: string[];
  totalDistance: number;
  totalDuration: number;
  optimizationScore: number;
  computeTime: number;
  warnings?: string[];
}
