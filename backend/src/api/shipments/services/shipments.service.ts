import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { ShipmentStatus, ShipmentType } from '@prisma/client';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createShipmentDto: CreateShipmentDto, userId: string) {
    const { origin, destination, ...rest } = createShipmentDto;

    // Generate shipment number if not provided
    const shipmentNumber =
      createShipmentDto.referenceNumber || (await this.generateShipmentNumber());

    // Check if shipment number is unique
    const existingShipment = await this.prisma.shipment.findUnique({
      where: { shipmentNumber },
    });

    if (existingShipment) {
      throw new ConflictException(
        'Shipment with this shipment number already exists',
      );
    }

    // Verify customer exists
    const customer = await this.prisma.company.findUnique({
      where: { id: createShipmentDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createShipmentDto.customerId} not found`,
      );
    }

    // Create Address records for origin and destination
    const originAddress = await this.prisma.address.create({
      data: {
        line1: origin.street,
        line2: origin.street2,
        city: origin.city,
        state: origin.state,
        postalCode: origin.postalCode,
        country: origin.country,
        latitude: origin.latitude,
        longitude: origin.longitude,
        type: 'WAREHOUSE',
      },
    });

    const destinationAddress = await this.prisma.address.create({
      data: {
        line1: destination.street,
        line2: destination.street2,
        city: destination.city,
        state: destination.state,
        postalCode: destination.postalCode,
        country: destination.country,
        latitude: destination.latitude,
        longitude: destination.longitude,
        type: 'CUSTOMER',
      },
    });

    // Create Contact records for shipper and consignee
    const shipperContact = await this.prisma.contact.create({
      data: {
        firstName: rest.customerName.split(' ')[0] || 'Unknown',
        lastName: rest.customerName.split(' ').slice(1).join(' ') || 'User',
        company: customer.name,
        email: rest.customerEmail,
        phone: rest.customerPhone || '',
        role: 'Shipper',
      },
    });

    const consigneeContact = await this.prisma.contact.create({
      data: {
        firstName: 'Consignee',
        lastName: 'User',
        phone: rest.customerPhone || '',
        role: 'Consignee',
      },
    });

    // Create shipment
    const shipment = await this.prisma.shipment.create({
      data: {
        shipmentNumber,
        referenceNumber: rest.referenceNumber,
        type: rest.type,
        priority: rest.priority || 'MEDIUM',
        serviceLevel: rest.serviceLevel || 'STANDARD',
        mode: 'PARCEL', // Default mode
        status: 'DRAFT',

        // Relations to Address
        originId: originAddress.id,
        destinationId: destinationAddress.id,

        // Relations to Contact
        shipperId: shipperContact.id,
        consigneeId: consigneeContact.id,

        // Customer info
        customerId: rest.customerId,
        customerName: rest.customerName,
        customerEmail: rest.customerEmail,
        customerPhone: rest.customerPhone,

        // Package info
        totalWeight: rest.totalWeight,
        totalVolume: rest.totalVolume,
        totalValue: rest.declaredValue || 0,
        packageCount: 1, // Default to 1 package
        weightUnit: rest.weightUnit || 'KG',
        dimensionUnit: rest.dimensionUnit || 'CM',

        // Dates
        pickupDate: rest.scheduledPickupDate
          ? new Date(rest.scheduledPickupDate)
          : null,
        deliveryDate: rest.estimatedDeliveryDate
          ? new Date(rest.estimatedDeliveryDate)
          : null,

        // Financial
        declaredValue: rest.declaredValue,
        currency: rest.currency || 'GBP',

        // Additional flags
        requiresSignature: rest.requiresSignature || false,
        hazmat: rest.isHazmat || false,
        fragile: rest.isFragile || false,
        specialInstructions: rest.specialInstructions,

        // User tracking
        createdById: userId,
      },
      select: {
        id: true,
        shipmentNumber: true,
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,
        mode: true,
        origin: {
          select: {
            line1: true,
            line2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        destination: {
          select: {
            line1: true,
            line2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        shipper: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        consignee: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        customerId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        totalWeight: true,
        totalVolume: true,
        totalValue: true,
        packageCount: true,
        weightUnit: true,
        dimensionUnit: true,
        declaredValue: true,
        currency: true,
        pickupDate: true,
        deliveryDate: true,
        requiresSignature: true,
        hazmat: true,
        fragile: true,
        specialInstructions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return shipment;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    status?: ShipmentStatus,
    type?: ShipmentType,
    customerId?: string,
  ) {
    const skip = (page - 1) * pageSize;

    // Build where clause for filters
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (customerId) where.customerId = customerId;

    const [shipments, total] = await Promise.all([
      this.prisma.shipment.findMany({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          shipmentNumber: true,
          referenceNumber: true,
          type: true,
          status: true,
          priority: true,
          serviceLevel: true,
          mode: true,
          origin: {
            select: {
              city: true,
              state: true,
              country: true,
            },
          },
          destination: {
            select: {
              city: true,
              state: true,
              country: true,
            },
          },
          customerId: true,
          customerName: true,
          company: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          totalWeight: true,
          totalVolume: true,
          weightUnit: true,
          dimensionUnit: true,
          pickupDate: true,
          deliveryDate: true,
          actualDelivery: true,
          trackingNumber: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.shipment.count({ where }),
    ]);

    return {
      data: shipments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      select: {
        id: true,
        shipmentNumber: true,
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,
        mode: true,

        // Origin
        origin: {
          select: {
            line1: true,
            line2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },

        // Destination
        destination: {
          select: {
            line1: true,
            line2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },

        // Contacts
        shipper: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
        consignee: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },

        // Carrier
        carrierId: true,
        carrier: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
          },
        },
        carrierServiceCode: true,
        trackingNumber: true,

        // Customer
        customerId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        // Package info
        totalWeight: true,
        totalVolume: true,
        totalValue: true,
        packageCount: true,
        weightUnit: true,
        dimensionUnit: true,

        // Dates
        pickupDate: true,
        actualPickup: true,
        deliveryDate: true,
        actualDelivery: true,

        // Financial
        declaredValue: true,
        currency: true,
        freightCost: true,
        insuranceCost: true,
        totalCost: true,

        // Additional
        requiresSignature: true,
        hazmat: true,
        fragile: true,
        temperatureControlled: true,
        temperatureMin: true,
        temperatureMax: true,
        temperatureUnit: true,
        specialInstructions: true,

        createdAt: true,
        updatedAt: true,

        // Relations
        items: {
          select: {
            id: true,
            sku: true,
            description: true,
            quantity: true,
            weight: true,
            volume: true,
            value: true,
            dimensions: true,
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            name: true,
            url: true,
            format: true,
            uploadedAt: true,
            uploadedBy: true,
          },
          orderBy: {
            uploadedAt: 'desc',
          },
        },
        trackingEvents: {
          select: {
            id: true,
            eventType: true,
            status: true,
            description: true,
            location: true,
            coordinates: true,
            facility: true,
            timestamp: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    // Get shipment with address IDs
    const existingShipment = await this.prisma.shipment.findUnique({
      where: { id },
      select: {
        id: true,
        originId: true,
        destinationId: true,
      },
    });

    if (!existingShipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    const { origin, destination, ...rest } = updateShipmentDto;

    // Build update data
    const updateData: any = {};

    // Handle origin address update
    if (origin) {
      await this.prisma.address.update({
        where: { id: existingShipment.originId },
        data: {
          line1: origin.street,
          line2: origin.street2,
          city: origin.city,
          state: origin.state,
          postalCode: origin.postalCode,
          country: origin.country,
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
      });
    }

    // Handle destination address update
    if (destination) {
      await this.prisma.address.update({
        where: { id: existingShipment.destinationId },
        data: {
          line1: destination.street,
          line2: destination.street2,
          city: destination.city,
          state: destination.state,
          postalCode: destination.postalCode,
          country: destination.country,
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      });
    }

    // Map DTO fields to schema fields
    if (rest.type !== undefined) updateData.type = rest.type;
    if (rest.priority !== undefined) updateData.priority = rest.priority;
    if (rest.serviceLevel !== undefined) updateData.serviceLevel = rest.serviceLevel;
    if (rest.customerName !== undefined) updateData.customerName = rest.customerName;
    if (rest.customerEmail !== undefined) updateData.customerEmail = rest.customerEmail;
    if (rest.customerPhone !== undefined) updateData.customerPhone = rest.customerPhone;
    if (rest.totalWeight !== undefined) updateData.totalWeight = rest.totalWeight;
    if (rest.totalVolume !== undefined) updateData.totalVolume = rest.totalVolume;
    if (rest.weightUnit !== undefined) updateData.weightUnit = rest.weightUnit;
    if (rest.dimensionUnit !== undefined) updateData.dimensionUnit = rest.dimensionUnit;
    if (rest.declaredValue !== undefined) {
      updateData.declaredValue = rest.declaredValue;
      updateData.totalValue = rest.declaredValue;
    }
    if (rest.currency !== undefined) updateData.currency = rest.currency;
    if (rest.requiresSignature !== undefined) updateData.requiresSignature = rest.requiresSignature;
    if (rest.isHazmat !== undefined) updateData.hazmat = rest.isHazmat;
    if (rest.isFragile !== undefined) updateData.fragile = rest.isFragile;
    if (rest.specialInstructions !== undefined) updateData.specialInstructions = rest.specialInstructions;

    // Convert date strings to Date objects
    if (rest.scheduledPickupDate) {
      updateData.pickupDate = new Date(rest.scheduledPickupDate);
    }
    if (rest.estimatedDeliveryDate) {
      updateData.deliveryDate = new Date(rest.estimatedDeliveryDate);
    }

    const shipment = await this.prisma.shipment.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        shipmentNumber: true,
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,
        mode: true,
        origin: {
          select: {
            line1: true,
            city: true,
            state: true,
            country: true,
          },
        },
        destination: {
          select: {
            line1: true,
            city: true,
            state: true,
            country: true,
          },
        },
        customerId: true,
        customerName: true,
        totalWeight: true,
        totalVolume: true,
        pickupDate: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return shipment;
  }

  async remove(id: string) {
    // Check if shipment exists
    await this.findOne(id);

    await this.prisma.shipment.delete({
      where: { id },
    });

    return { message: 'Shipment deleted successfully' };
  }

  async updateStatus(id: string, status: ShipmentStatus) {
    // Check if shipment exists
    await this.findOne(id);

    // Validate status transition
    const validStatuses = Object.values(ShipmentStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const shipment = await this.prisma.shipment.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        shipmentNumber: true,
        referenceNumber: true,
        status: true,
        type: true,
        customerName: true,
        updatedAt: true,
      },
    });

    // Create tracking event for status change
    await this.prisma.shipmentTracking.create({
      data: {
        shipmentId: id,
        eventType: 'UPDATED',
        status,
        description: `Shipment status changed to ${status}`,
        source: 'MANUAL',
        timestamp: new Date(),
      },
    });

    return shipment;
  }

  async getTracking(id: string) {
    // Check if shipment exists
    await this.findOne(id);

    const tracking = await this.prisma.shipmentTracking.findMany({
      where: { shipmentId: id },
      select: {
        id: true,
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
        createdBy: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return {
      shipmentId: id,
      events: tracking,
      totalEvents: tracking.length,
    };
  }

  async generateShipmentNumber(): Promise<string> {
    const prefix = 'SHP';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get count of shipments created this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0, 23, 59, 59);

    const count = await this.prisma.shipment.count({
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
