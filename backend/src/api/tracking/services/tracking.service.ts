import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateTrackingDto } from '../dto/create-tracking.dto';
import { UpdateTrackingDto } from '../dto/update-tracking.dto';
import { ShipmentStatus } from '@prisma/client';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackingDto: CreateTrackingDto) {
    const { location, timestamp, ...rest } = createTrackingDto;

    // Verify shipment exists
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: createTrackingDto.shipmentId },
    });

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with ID ${createTrackingDto.shipmentId} not found`,
      );
    }

    // Verify package exists if packageId is provided
    if (createTrackingDto.packageId) {
      const packageExists = await this.prisma.package.findUnique({
        where: { id: createTrackingDto.packageId },
      });

      if (!packageExists) {
        throw new NotFoundException(
          `Package with ID ${createTrackingDto.packageId} not found`,
        );
      }
    }

    // Create tracking event
    const trackingEvent = await this.prisma.shipmentTracking.create({
      data: {
        shipmentId: rest.shipmentId,
        packageId: rest.packageId,
        status: rest.status,
        description: rest.description,
        locationStreet: location?.address,
        locationCity: location?.city,
        locationState: location?.state,
        locationCountry: location?.country,
        latitude: location?.latitude,
        longitude: location?.longitude,
        facility: location?.facility,
        facilityType: location?.facilityType,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        createdBy: rest.createdBy,
        metadata: rest.metadata,
      },
      select: {
        id: true,
        shipmentId: true,
        packageId: true,
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
        metadata: true,
      },
    });

    // Update shipment status
    await this.prisma.shipment.update({
      where: { id: createTrackingDto.shipmentId },
      data: { status: rest.status },
    });

    return trackingEvent;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    shipmentId?: string,
    packageId?: string,
    status?: ShipmentStatus,
  ) {
    const skip = (page - 1) * pageSize;

    // Build where clause for filters
    const where: any = {};
    if (shipmentId) where.shipmentId = shipmentId;
    if (packageId) where.packageId = packageId;
    if (status) where.status = status;

    const [events, total] = await Promise.all([
      this.prisma.shipmentTracking.findMany({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          shipmentId: true,
          packageId: true,
          status: true,
          description: true,
          locationCity: true,
          locationState: true,
          locationCountry: true,
          facility: true,
          facilityType: true,
          timestamp: true,
          createdBy: true,
          shipment: {
            select: {
              id: true,
              referenceNumber: true,
              trackingNumber: true,
              customerName: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      }),
      this.prisma.shipmentTracking.count({ where }),
    ]);

    return {
      data: events,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.shipmentTracking.findUnique({
      where: { id },
      select: {
        id: true,
        shipmentId: true,
        packageId: true,
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
        metadata: true,
        shipment: {
          select: {
            id: true,
            referenceNumber: true,
            trackingNumber: true,
            type: true,
            priority: true,
            customerName: true,
            originCity: true,
            originCountry: true,
            destCity: true,
            destCountry: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Tracking event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateTrackingDto: UpdateTrackingDto) {
    // Check if tracking event exists
    await this.findOne(id);

    const { location, timestamp, ...rest } = updateTrackingDto;

    // Build update data
    const updateData: any = { ...rest };

    if (location) {
      updateData.locationStreet = location.address;
      updateData.locationCity = location.city;
      updateData.locationState = location.state;
      updateData.locationCountry = location.country;
      updateData.latitude = location.latitude;
      updateData.longitude = location.longitude;
      updateData.facility = location.facility;
      updateData.facilityType = location.facilityType;
    }

    if (timestamp) {
      updateData.timestamp = new Date(timestamp);
    }

    const event = await this.prisma.shipmentTracking.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        shipmentId: true,
        packageId: true,
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
        metadata: true,
      },
    });

    return event;
  }

  async remove(id: string) {
    // Check if tracking event exists
    await this.findOne(id);

    await this.prisma.shipmentTracking.delete({
      where: { id },
    });

    return { message: 'Tracking event deleted successfully' };
  }

  async getByShipment(shipmentId: string) {
    // Verify shipment exists
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        id: true,
        referenceNumber: true,
        trackingNumber: true,
        status: true,
        type: true,
        customerName: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipmentId} not found`);
    }

    const events = await this.prisma.shipmentTracking.findMany({
      where: { shipmentId },
      select: {
        id: true,
        packageId: true,
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
        metadata: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return {
      shipment,
      events,
      totalEvents: events.length,
    };
  }

  async getByPackage(packageId: string) {
    // Verify package exists
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        packageNumber: true,
        trackingNumber: true,
        shipmentId: true,
        shipment: {
          select: {
            id: true,
            referenceNumber: true,
            trackingNumber: true,
            status: true,
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${packageId} not found`);
    }

    const events = await this.prisma.shipmentTracking.findMany({
      where: { packageId },
      select: {
        id: true,
        shipmentId: true,
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
        metadata: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return {
      package: pkg,
      events,
      totalEvents: events.length,
    };
  }

  async createEvent(data: CreateTrackingDto) {
    return this.create(data);
  }
}
