import api from './api';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  shipmentId: string;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  invoiceNumber: string;
  shipmentId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  currency?: string;
  notes?: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface UpdateInvoiceDto {
  invoiceNumber?: string;
  status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate?: string;
  dueDate?: string;
  paidDate?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  currency?: string;
  notes?: string;
}

export interface CostCalculationRequest {
  weight: number;
  volume: number;
  distance?: number;
  serviceLevel?: string;
  isHazmat?: boolean;
  isFragile?: boolean;
  requiresSignature?: boolean;
  declaredValue?: number;
}

export interface CostCalculationResponse {
  baseRate: number;
  fuelSurcharge: number;
  additionalCharges: number;
  tax: number;
  total: number;
  currency: string;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

export interface PaginatedInvoicesResponse {
  data: Invoice[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

class BillingService {
  /**
   * Get all invoices with optional filters and pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED',
    shipmentId?: string
  ): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (status) params.append('status', status);
    if (shipmentId) params.append('shipmentId', shipmentId);

    const response = await api.get<PaginatedInvoicesResponse>(`/billing?${params.toString()}`);
    return response.data;
  }

  /**
   * Get a single invoice by ID
   */
  async getById(id: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`/billing/${id}`);
    return response.data;
  }

  /**
   * Get all invoices for a specific shipment
   */
  async getByShipment(shipmentId: string): Promise<Invoice[]> {
    const response = await api.get<Invoice[]>(`/billing/shipment/${shipmentId}`);
    return response.data;
  }

  /**
   * Create a new invoice
   */
  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const response = await api.post<Invoice>('/billing', data);
    return response.data;
  }

  /**
   * Generate invoice for a shipment
   */
  async generateInvoice(shipmentId: string): Promise<Invoice> {
    const response = await api.post<Invoice>(`/billing/generate/${shipmentId}`);
    return response.data;
  }

  /**
   * Calculate cost for a shipment
   */
  async calculateCost(data: CostCalculationRequest): Promise<CostCalculationResponse> {
    const response = await api.post<CostCalculationResponse>('/billing/calculate-cost', data);
    return response.data;
  }

  /**
   * Update an existing invoice
   */
  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice> {
    const response = await api.patch<Invoice>(`/billing/${id}`, data);
    return response.data;
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string): Promise<Invoice> {
    const response = await api.patch<Invoice>(`/billing/${id}/pay`);
    return response.data;
  }

  /**
   * Delete an invoice
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/billing/${id}`);
  }
}

export default new BillingService();
