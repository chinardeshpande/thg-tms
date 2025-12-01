// User Types
export * from './user.types';

// Shipment Types
export * from './shipment.types';

// Carrier Types
export * from './carrier.types';

// Route Types
export * from './route.types';

// Analytics Types
export * from './analytics.types';

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: Date;
}
