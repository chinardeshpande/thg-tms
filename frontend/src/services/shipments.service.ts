import api from './api';

export interface Shipment {
  id: string;
  trackingNumber: string;
  type: 'DOMESTIC' | 'INTERNATIONAL' | 'EXPRESS';
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DELAYED' | 'EXCEPTION';
  customerId: string;
  originAddress: string;
  destinationAddress: string;
  originCity: string;
  originState: string;
  originCountry: string;
  originZip: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationZip: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  declaredValue?: number;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  carrierId?: string;
  routeId?: string;
  notes?: string;
  companyId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShipmentDto {
  trackingNumber: string;
  type: 'DOMESTIC' | 'INTERNATIONAL' | 'EXPRESS';
  customerId: string;
  originAddress: string;
  destinationAddress: string;
  originCity: string;
  originState: string;
  originCountry: string;
  originZip: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationZip: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  declaredValue?: number;
  estimatedDeliveryDate?: string;
  carrierId?: string;
  notes?: string;
}

export interface UpdateShipmentDto {
  trackingNumber?: string;
  type?: 'DOMESTIC' | 'INTERNATIONAL' | 'EXPRESS';
  status?: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DELAYED' | 'EXCEPTION';
  customerId?: string;
  originAddress?: string;
  destinationAddress?: string;
  originCity?: string;
  originState?: string;
  originCountry?: string;
  originZip?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationCountry?: string;
  destinationZip?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  declaredValue?: number;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  carrierId?: string;
  routeId?: string;
  notes?: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  eventType: 'CREATED' | 'UPDATED' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'DEPARTED' | 'DELIVERED' | 'EXCEPTION' | 'DELAYED';
  status: string;
  location: string;
  coordinates?: any;
  timestamp: string;
  description?: string;
  createdAt: string;
}

export interface PaginatedShipmentsResponse {
  data: Shipment[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

class ShipmentsService {
  /**
   * Get all shipments with optional filters and pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    status?: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DELAYED' | 'EXCEPTION',
    type?: 'DOMESTIC' | 'INTERNATIONAL' | 'EXPRESS',
    customerId?: string
  ): Promise<PaginatedShipmentsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (customerId) params.append('customerId', customerId);

    const response = await api.get<PaginatedShipmentsResponse>(`/shipments?${params.toString()}`);
    return response.data;
  }

  /**
   * Get a single shipment by ID
   */
  async getById(id: string): Promise<Shipment> {
    const response = await api.get<Shipment>(`/shipments/${id}`);
    return response.data;
  }

  /**
   * Get tracking events for a shipment
   */
  async getTracking(shipmentId: string): Promise<TrackingEvent[]> {
    const response = await api.get<TrackingEvent[]>(`/shipments/${shipmentId}/tracking`);
    return response.data;
  }

  /**
   * Create a new shipment
   */
  async create(data: CreateShipmentDto): Promise<Shipment> {
    const response = await api.post<Shipment>('/shipments', data);
    return response.data;
  }

  /**
   * Update an existing shipment
   */
  async update(id: string, data: UpdateShipmentDto): Promise<Shipment> {
    const response = await api.patch<Shipment>(`/shipments/${id}`, data);
    return response.data;
  }

  /**
   * Update shipment status
   */
  async updateStatus(
    id: string,
    status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DELAYED' | 'EXCEPTION'
  ): Promise<Shipment> {
    const response = await api.patch<Shipment>(`/shipments/${id}/status`, { status });
    return response.data;
  }

  /**
   * Delete a shipment
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/shipments/${id}`);
  }
}

export default new ShipmentsService();
