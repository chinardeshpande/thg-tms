import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { dueDate, ...rest } = createInvoiceDto;

    // Generate invoice number if not provided
    const invoiceNumber =
      createInvoiceDto.invoiceNumber || (await this.generateInvoiceNumber());

    // Check if invoice number is unique
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (existingInvoice) {
      throw new ConflictException(
        'Invoice with this number already exists',
      );
    }

    // Verify shipment exists
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: createInvoiceDto.shipmentId },
    });

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with ID ${createInvoiceDto.shipmentId} not found`,
      );
    }

    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        shipmentId: rest.shipmentId,
        status: 'PENDING',
        subtotal: rest.subtotal,
        tax: rest.tax,
        total: rest.total,
        currency: rest.currency || 'GBP',
        dueDate: new Date(dueDate),
      },
      select: {
        id: true,
        invoiceNumber: true,
        shipmentId: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return invoice;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    status?: InvoiceStatus,
    shipmentId?: string,
  ) {
    const skip = (page - 1) * pageSize;

    // Build where clause for filters
    const where: any = {};
    if (status) where.status = status;
    if (shipmentId) where.shipmentId = shipmentId;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          invoiceNumber: true,
          shipmentId: true,
          status: true,
          subtotal: true,
          tax: true,
          total: true,
          currency: true,
          dueDate: true,
          paidAt: true,
          createdAt: true,
          updatedAt: true,
          shipment: {
            select: {
              id: true,
              referenceNumber: true,
              customerName: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        shipmentId: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
        shipment: {
          select: {
            id: true,
            referenceNumber: true,
            trackingNumber: true,
            type: true,
            status: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            originCity: true,
            originCountry: true,
            destCity: true,
            destCountry: true,
            totalWeight: true,
            weightUnit: true,
            declaredValue: true,
            company: {
              select: {
                id: true,
                name: true,
                businessId: true,
                email: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    // Check if invoice exists
    await this.findOne(id);

    const { dueDate, ...rest } = updateInvoiceDto;

    // Build update data
    const updateData: any = { ...rest };

    if (dueDate) {
      updateData.dueDate = new Date(dueDate);
    }

    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        invoiceNumber: true,
        shipmentId: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return invoice;
  }

  async remove(id: string) {
    // Check if invoice exists
    await this.findOne(id);

    await this.prisma.invoice.delete({
      where: { id },
    });

    return { message: 'Invoice deleted successfully' };
  }

  async generateInvoice(shipmentId: string) {
    // Verify shipment exists
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        id: true,
        freightCost: true,
        insuranceCost: true,
        totalCost: true,
        currency: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipmentId} not found`);
    }

    // Check if invoice already exists for this shipment
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: { shipmentId },
    });

    if (existingInvoice) {
      throw new ConflictException(
        'Invoice already exists for this shipment',
      );
    }

    // Calculate invoice amounts
    const subtotal = shipment.totalCost || 0;
    const taxRate = 0.2; // 20% VAT
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // Set due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        shipmentId,
        status: 'PENDING',
        subtotal,
        tax,
        total,
        currency: shipment.currency || 'GBP',
        dueDate,
      },
      select: {
        id: true,
        invoiceNumber: true,
        shipmentId: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        createdAt: true,
        shipment: {
          select: {
            referenceNumber: true,
            customerName: true,
          },
        },
      },
    });

    return invoice;
  }

  async markAsPaid(invoiceId: string) {
    // Check if invoice exists
    const invoice = await this.findOne(invoiceId);

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already marked as paid');
    }

    if (invoice.status === 'CANCELLED') {
      throw new BadRequestException('Cannot mark cancelled invoice as paid');
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
      select: {
        id: true,
        invoiceNumber: true,
        shipmentId: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        paidAt: true,
        updatedAt: true,
      },
    });

    return updatedInvoice;
  }

  async getByShipment(shipmentId: string) {
    // Verify shipment exists
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        id: true,
        referenceNumber: true,
        customerName: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipmentId} not found`);
    }

    const invoices = await this.prisma.invoice.findMany({
      where: { shipmentId },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        dueDate: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      shipment,
      invoices,
      totalInvoices: invoices.length,
    };
  }

  async calculateCost(shipmentData: {
    weight: number;
    volume: number;
    distance?: number;
    serviceLevel?: string;
    isHazmat?: boolean;
    isFragile?: boolean;
    requiresSignature?: boolean;
    declaredValue?: number;
  }) {
    // Base rate calculation
    const baseRatePerKg = 2.5; // GBP per kg
    const baseRatePerCubicMeter = 50.0; // GBP per cubic meter

    let freightCost =
      shipmentData.weight * baseRatePerKg +
      shipmentData.volume * baseRatePerCubicMeter;

    // Distance surcharge (if provided)
    if (shipmentData.distance) {
      const distanceRate = 0.5; // GBP per km
      freightCost += shipmentData.distance * distanceRate;
    }

    // Service level multiplier
    const serviceLevelMultipliers: Record<string, number> = {
      STANDARD: 1.0,
      EXPRESS: 1.5,
      NEXT_DAY: 2.0,
      SAME_DAY: 3.0,
    };

    const serviceMultiplier =
      serviceLevelMultipliers[shipmentData.serviceLevel || 'STANDARD'] || 1.0;
    freightCost *= serviceMultiplier;

    // Additional service fees
    let additionalFees = 0;

    if (shipmentData.isHazmat) {
      additionalFees += 50.0; // Hazmat handling fee
    }

    if (shipmentData.isFragile) {
      additionalFees += 25.0; // Fragile handling fee
    }

    if (shipmentData.requiresSignature) {
      additionalFees += 10.0; // Signature required fee
    }

    // Insurance cost (0.5% of declared value, minimum 5 GBP)
    let insuranceCost = 0;
    if (shipmentData.declaredValue) {
      insuranceCost = Math.max(shipmentData.declaredValue * 0.005, 5.0);
    }

    // Total cost
    const subtotal = freightCost + additionalFees + insuranceCost;
    const taxRate = 0.2; // 20% VAT
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      freightCost: parseFloat(freightCost.toFixed(2)),
      insuranceCost: parseFloat(insuranceCost.toFixed(2)),
      additionalFees: parseFloat(additionalFees.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      currency: 'GBP',
      breakdown: {
        baseRate: parseFloat(
          (
            shipmentData.weight * baseRatePerKg +
            shipmentData.volume * baseRatePerCubicMeter
          ).toFixed(2),
        ),
        serviceMultiplier,
        distanceSurcharge: shipmentData.distance
          ? parseFloat((shipmentData.distance * 0.5).toFixed(2))
          : 0,
        hazmatFee: shipmentData.isHazmat ? 50.0 : 0,
        fragileFee: shipmentData.isFragile ? 25.0 : 0,
        signatureFee: shipmentData.requiresSignature ? 10.0 : 0,
      },
    };
  }

  async generateInvoiceNumber(): Promise<string> {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get count of invoices created this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0, 23, 59, 59);

    const count = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const sequence = String(count + 1).padStart(5, '0');
    return `${prefix}-${year}${month}-${sequence}`;
  }
}
