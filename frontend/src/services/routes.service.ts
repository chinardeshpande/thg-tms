import api from './api';

export interface Route {
  id: string;
  name: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  driverId?: string;
  vehicleId?: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  totalDistance?: number;
  estimatedDuration?: number;
  notes?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  id: string;
  routeId: string;
  shipmentId?: string;
  stopNumber: number;
  stopType: 'PICKUP' | 'DELIVERY' | 'WAYPOINT';
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  coordinates?: any;
  plannedArrival?: string;
  plannedDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteDto {
  name: string;
  driverId?: string;
  vehicleId?: string;
  plannedStartTime: string;
  plannedEndTime: string;
  totalDistance?: number;
  estimatedDuration?: number;
  notes?: string;
  stops?: {
    shipmentId?: string;
    stopNumber: number;
    stopType: 'PICKUP' | 'DELIVERY' | 'WAYPOINT';
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    coordinates?: any;
    plannedArrival?: string;
    plannedDeparture?: string;
    notes?: string;
  }[];
}

export interface UpdateRouteDto {
  name?: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  driverId?: string;
  vehicleId?: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  totalDistance?: number;
  estimatedDuration?: number;
  notes?: string;
}

export interface PaginatedRoutesResponse {
  data: Route[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

class RoutesService {
  /**
   * Get all routes with optional filters and pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    driverId?: string,
    vehicleId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedRoutesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (status) params.append('status', status);
    if (driverId) params.append('driverId', driverId);
    if (vehicleId) params.append('vehicleId', vehicleId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<PaginatedRoutesResponse>(`/routes?${params.toString()}`);
    return response.data;
  }

  /**
   * Get a single route by ID
   */
  async getById(id: string): Promise<Route> {
    const response = await api.get<Route>(`/routes/${id}`);
    return response.data;
  }

  /**
   * Get all stops for a route
   */
  async getStops(routeId: string): Promise<RouteStop[]> {
    const response = await api.get<RouteStop[]>(`/routes/${routeId}/stops`);
    return response.data;
  }

  /**
   * Create a new route
   */
  async create(data: CreateRouteDto): Promise<Route> {
    const response = await api.post<Route>('/routes', data);
    return response.data;
  }

  /**
   * Update an existing route
   */
  async update(id: string, data: UpdateRouteDto): Promise<Route> {
    const response = await api.patch<Route>(`/routes/${id}`, data);
    return response.data;
  }

  /**
   * Update route status
   */
  async updateStatus(
    id: string,
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  ): Promise<Route> {
    const response = await api.patch<Route>(`/routes/${id}/status`, { status });
    return response.data;
  }

  /**
   * Assign driver to route
   */
  async assignDriver(id: string, driverId: string): Promise<Route> {
    const response = await api.post<Route>(`/routes/${id}/assign-driver`, { driverId });
    return response.data;
  }

  /**
   * Assign vehicle to route
   */
  async assignVehicle(id: string, vehicleId: string): Promise<Route> {
    const response = await api.post<Route>(`/routes/${id}/assign-vehicle`, { vehicleId });
    return response.data;
  }

  /**
   * Delete a route
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/routes/${id}`);
  }
}

export default new RoutesService();
