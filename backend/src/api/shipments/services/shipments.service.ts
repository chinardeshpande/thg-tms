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

  async create(createShipmentDto: CreateShipmentDto) {
    const { origin, destination, ...rest } = createShipmentDto;

    // Generate reference number if not provided
    const referenceNumber =
      createShipmentDto.referenceNumber || (await this.generateReferenceNumber());

    // Check if reference number is unique
    const existingShipment = await this.prisma.shipment.findUnique({
      where: { referenceNumber },
    });

    if (existingShipment) {
      throw new ConflictException(
        'Shipment with this reference number already exists',
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

    // Create shipment
    const shipment = await this.prisma.shipment.create({
      data: {
        referenceNumber,
        type: rest.type,
        priority: rest.priority || 'MEDIUM',
        serviceLevel: rest.serviceLevel || 'STANDARD',
        status: 'DRAFT',

        // Origin address
        originStreet: origin.street,
        originStreet2: origin.street2,
        originCity: origin.city,
        originState: origin.state,
        originPostalCode: origin.postalCode,
        originCountry: origin.country,
        originLatitude: origin.latitude,
        originLongitude: origin.longitude,

        // Destination address
        destStreet: destination.street,
        destStreet2: destination.street2,
        destCity: destination.city,
        destState: destination.state,
        destPostalCode: destination.postalCode,
        destCountry: destination.country,
        destLatitude: destination.latitude,
        destLongitude: destination.longitude,

        // Customer info
        customerId: rest.customerId,
        customerName: rest.customerName,
        customerEmail: rest.customerEmail,
        customerPhone: rest.customerPhone,

        // Package info
        totalWeight: rest.totalWeight,
        totalVolume: rest.totalVolume,
        weightUnit: rest.weightUnit || 'KG',
        dimensionUnit: rest.dimensionUnit || 'CM',

        // Dates
        scheduledPickupDate: rest.scheduledPickupDate
          ? new Date(rest.scheduledPickupDate)
          : null,
        estimatedDeliveryDate: rest.estimatedDeliveryDate
          ? new Date(rest.estimatedDeliveryDate)
          : null,

        // Financial
        declaredValue: rest.declaredValue,
        currency: rest.currency || 'GBP',

        // Additional flags
        requiresSignature: rest.requiresSignature || false,
        isHazmat: rest.isHazmat || false,
        isFragile: rest.isFragile || false,
        specialInstructions: rest.specialInstructions,
      },
      select: {
        id: true,
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,
        originStreet: true,
        originStreet2: true,
        originCity: true,
        originState: true,
        originPostalCode: true,
        originCountry: true,
        destStreet: true,
        destStreet2: true,
        destCity: true,
        destState: true,
        destPostalCode: true,
        destCountry: true,
        customerId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        totalWeight: true,
        totalVolume: true,
        weightUnit: true,
        dimensionUnit: true,
        declaredValue: true,
        currency: true,
        scheduledPickupDate: true,
        estimatedDeliveryDate: true,
        requiresSignature: true,
        isHazmat: true,
        isFragile: true,
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
          referenceNumber: true,
          type: true,
          status: true,
          priority: true,
          serviceLevel: true,
          originCity: true,
          originState: true,
          originCountry: true,
          destCity: true,
          destState: true,
          destCountry: true,
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
          scheduledPickupDate: true,
          estimatedDeliveryDate: true,
          actualDeliveryDate: true,
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
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,

        // Origin
        originStreet: true,
        originStreet2: true,
        originCity: true,
        originState: true,
        originPostalCode: true,
        originCountry: true,
        originLatitude: true,
        originLongitude: true,

        // Destination
        destStreet: true,
        destStreet2: true,
        destCity: true,
        destState: true,
        destPostalCode: true,
        destCountry: true,
        destLatitude: true,
        destLongitude: true,

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
        weightUnit: true,
        dimensionUnit: true,

        // Dates
        scheduledPickupDate: true,
        actualPickupDate: true,
        estimatedDeliveryDate: true,
        actualDeliveryDate: true,

        // Financial
        declaredValue: true,
        currency: true,
        freightCost: true,
        insuranceCost: true,
        totalCost: true,

        // Additional
        requiresSignature: true,
        isHazmat: true,
        isFragile: true,
        isTemperatureControlled: true,
        temperatureMin: true,
        temperatureMax: true,
        temperatureUnit: true,
        specialInstructions: true,

        createdAt: true,
        updatedAt: true,

        // Relations
        packages: {
          select: {
            id: true,
            packageNumber: true,
            trackingNumber: true,
            length: true,
            width: true,
            height: true,
            weight: true,
            description: true,
            labelUrl: true,
            labelFormat: true,
            createdAt: true,
          },
          orderBy: {
            packageNumber: 'asc',
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
            status: true,
            description: true,
            locationCity: true,
            locationState: true,
            locationCountry: true,
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
    // Check if shipment exists
    await this.findOne(id);

    const { origin, destination, ...rest } = updateShipmentDto;

    // Build update data
    const updateData: any = { ...rest };

    // Update origin address if provided
    if (origin) {
      updateData.originStreet = origin.street;
      updateData.originStreet2 = origin.street2;
      updateData.originCity = origin.city;
      updateData.originState = origin.state;
      updateData.originPostalCode = origin.postalCode;
      updateData.originCountry = origin.country;
      updateData.originLatitude = origin.latitude;
      updateData.originLongitude = origin.longitude;
    }

    // Update destination address if provided
    if (destination) {
      updateData.destStreet = destination.street;
      updateData.destStreet2 = destination.street2;
      updateData.destCity = destination.city;
      updateData.destState = destination.state;
      updateData.destPostalCode = destination.postalCode;
      updateData.destCountry = destination.country;
      updateData.destLatitude = destination.latitude;
      updateData.destLongitude = destination.longitude;
    }

    // Convert date strings to Date objects
    if (updateData.scheduledPickupDate) {
      updateData.scheduledPickupDate = new Date(updateData.scheduledPickupDate);
    }
    if (updateData.estimatedDeliveryDate) {
      updateData.estimatedDeliveryDate = new Date(
        updateData.estimatedDeliveryDate,
      );
    }

    const shipment = await this.prisma.shipment.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        referenceNumber: true,
        type: true,
        status: true,
        priority: true,
        serviceLevel: true,
        originStreet: true,
        originCity: true,
        originState: true,
        originCountry: true,
        destStreet: true,
        destCity: true,
        destState: true,
        destCountry: true,
        customerId: true,
        customerName: true,
        totalWeight: true,
        totalVolume: true,
        scheduledPickupDate: true,
        estimatedDeliveryDate: true,
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
        status,
        description: `Shipment status changed to ${status}`,
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
        status: true,
        description: true,
        locationStreet: true,
        locationCity: true,
        locationState: true,
        locationCountry: true,
        latitude: true,
        longitude: true,
        facility: true,
        facilityType: true,
        timestamp: true,
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

  async generateReferenceNumber(): Promise<string> {
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
