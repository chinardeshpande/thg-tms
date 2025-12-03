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

    // Build location string from location data
    const locationString = location
      ? [location.address, location.city, location.state, location.country]
          .filter(Boolean)
          .join(', ')
      : undefined;

    // Build coordinates JSON from lat/lng
    const coordinates = location?.latitude && location?.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : undefined;

    // Create tracking event
    const trackingEvent = await this.prisma.shipmentTracking.create({
      data: {
        shipmentId: rest.shipmentId,
        eventType: 'UPDATED', // Default event type
        status: rest.status,
        description: rest.description,
        location: locationString,
        coordinates: coordinates,
        facility: location?.facility,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        source: 'MANUAL', // Default source
        createdBy: rest.createdBy,
        metadata: rest.metadata,
      },
      select: {
        id: true,
        shipmentId: true,
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
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
          eventType: true,
          status: true,
          description: true,
          location: true,
          coordinates: true,
          facility: true,
          timestamp: true,
          source: true,
          createdBy: true,
          metadata: true,
          shipment: {
            select: {
              id: true,
              shipmentNumber: true,
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
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
        createdBy: true,
        metadata: true,
        shipment: {
          select: {
            id: true,
            shipmentNumber: true,
            referenceNumber: true,
            trackingNumber: true,
            type: true,
            priority: true,
            customerName: true,
            origin: {
              select: {
                city: true,
                country: true,
              },
            },
            destination: {
              select: {
                city: true,
                country: true,
              },
            },
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
    const updateData: any = {};

    if (rest.status !== undefined) updateData.status = rest.status;
    if (rest.description !== undefined) updateData.description = rest.description;

    if (location) {
      // Build location string from components
      const locationParts = [
        location.address,
        location.city,
        location.state,
        location.country,
      ].filter(Boolean);
      updateData.location = locationParts.join(', ');

      // Store coordinates as JSON
      if (location.latitude && location.longitude) {
        updateData.coordinates = {
          lat: location.latitude,
          lng: location.longitude,
        };
      }

      if (location.facility) {
        updateData.facility = location.facility;
      }
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
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
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
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
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

  // Note: Package model doesn't exist in current schema
  // This method is disabled until Package model is added
  async getByPackage(packageId: string) {
    throw new BadRequestException(
      'Package tracking is not available. Package model not implemented in current schema.',
    );

    /* Original implementation - requires Package model
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
            shipmentNumber: true,
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
        eventType: true,
        status: true,
        description: true,
        location: true,
        coordinates: true,
        facility: true,
        timestamp: true,
        source: true,
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
    */
  }

  async createEvent(data: CreateTrackingDto) {
    return this.create(data);
  }
}
