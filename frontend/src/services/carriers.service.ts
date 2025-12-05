import api from './api';

export interface Carrier {
  id: string;
  name: string;
  code: string;
  type: 'AIR' | 'OCEAN' | 'GROUND' | 'RAIL';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rating?: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarrierDto {
  name: string;
  code: string;
  type: 'AIR' | 'OCEAN' | 'GROUND' | 'RAIL';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UpdateCarrierDto {
  name?: string;
  code?: string;
  type?: 'AIR' | 'OCEAN' | 'GROUND' | 'RAIL';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CarrierService {
  id: string;
  carrierId: string;
  name: string;
  description?: string;
  serviceType: string;
  transitTimeMin: number;
  transitTimeMax: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierRate {
  id: string;
  carrierId: string;
  serviceId?: string;
  origin: string;
  destination: string;
  baseRate: number;
  fuelSurcharge: number;
  currency: string;
  validFrom: string;
  validTo: string;
  minimumCharge: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCarriersResponse {
  data: Carrier[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

class CarriersService {
  /**
   * Get all carriers with optional filters and pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    type?: 'AIR' | 'OCEAN' | 'GROUND' | 'RAIL',
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ): Promise<PaginatedCarriersResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    const response = await api.get<PaginatedCarriersResponse>(`/carriers?${params.toString()}`);
    return response.data;
  }

  /**
   * Get a single carrier by ID
   */
  async getById(id: string): Promise<Carrier> {
    const response = await api.get<Carrier>(`/carriers/${id}`);
    return response.data;
  }

  /**
   * Get services for a specific carrier
   */
  async getServices(carrierId: string): Promise<CarrierService[]> {
    const response = await api.get<CarrierService[]>(`/carriers/${carrierId}/services`);
    return response.data;
  }

  /**
   * Get rates for a specific carrier
   */
  async getRates(carrierId: string): Promise<CarrierRate[]> {
    const response = await api.get<CarrierRate[]>(`/carriers/${carrierId}/rates`);
    return response.data;
  }

  /**
   * Create a new carrier
   */
  async create(data: CreateCarrierDto): Promise<Carrier> {
    const response = await api.post<Carrier>('/carriers', data);
    return response.data;
  }

  /**
   * Update an existing carrier
   */
  async update(id: string, data: UpdateCarrierDto): Promise<Carrier> {
    const response = await api.patch<Carrier>(`/carriers/${id}`, data);
    return response.data;
  }

  /**
   * Delete a carrier
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/carriers/${id}`);
  }
}

export default new CarriersService();
