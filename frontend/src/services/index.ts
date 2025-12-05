// Export all services for easy importing
export { default as authService } from './auth.service';
export { default as carriersService } from './carriers.service';
export { default as shipmentsService } from './shipments.service';
export { default as routesService } from './routes.service';
export { default as billingService } from './billing.service';

// Export types
export type { LoginCredentials, RegisterData, AuthResponse, User } from './auth.service';
export type { Carrier, CreateCarrierDto, UpdateCarrierDto, CarrierService, CarrierRate } from './carriers.service';
export type { Shipment, CreateShipmentDto, UpdateShipmentDto, TrackingEvent } from './shipments.service';
export type { Route, RouteStop, CreateRouteDto, UpdateRouteDto } from './routes.service';
export type { Invoice, InvoiceItem, CreateInvoiceDto, UpdateInvoiceDto, CostCalculationRequest, CostCalculationResponse } from './billing.service';
