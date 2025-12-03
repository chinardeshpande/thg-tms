import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { RouteStatus } from '@prisma/client';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async create(createRouteDto: CreateRouteDto) {
    const { stops, ...routeData } = createRouteDto;

    // Generate route number if not provided
    const routeNumber =
      createRouteDto.routeNumber || (await this.generateRouteNumber());

    // Check if route number is unique
    const existingRoute = await this.prisma.route.findUnique({
      where: { routeNumber },
    });

    if (existingRoute) {
      throw new ConflictException(
        'Route with this route number already exists',
      );
    }

    // Verify vehicle exists if provided
    if (createRouteDto.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: createRouteDto.vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with ID ${createRouteDto.vehicleId} not found`,
        );
      }
    }

    // Verify driver exists if provided
    if (createRouteDto.driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: createRouteDto.driverId },
      });
      if (!driver) {
        throw new NotFoundException(
          `Driver with ID ${createRouteDto.driverId} not found`,
        );
      }
    }

    // Create route with stops
    const route = await this.prisma.route.create({
      data: {
        routeNumber,
        status: 'PLANNED',
        vehicleId: routeData.vehicleId,
        vehicleType: routeData.vehicleType,
        driverId: routeData.driverId,
        driverName: routeData.driverName,
        totalDistance: routeData.totalDistance,
        totalDuration: routeData.totalDuration,
        distanceUnit: routeData.distanceUnit || 'km',
        plannedStartTime: new Date(routeData.plannedStartTime),
        plannedEndTime: new Date(routeData.plannedEndTime),
        totalWeight: routeData.totalWeight,
        totalVolume: routeData.totalVolume,
        totalPackages: routeData.totalPackages,
        stops: {
          create: stops.map((stop) => ({
            sequenceNumber: stop.sequenceNumber,
            stopType: stop.stopType,
            status: 'PENDING',
            street: stop.street,
            street2: stop.street2,
            city: stop.city,
            state: stop.state,
            postalCode: stop.postalCode,
            country: stop.country,
            latitude: stop.latitude,
            longitude: stop.longitude,
            plannedArrivalTime: new Date(stop.plannedArrivalTime),
            plannedDepartureTime: new Date(stop.plannedDepartureTime),
            serviceTime: stop.serviceTime,
            contactName: stop.contactName,
            contactPhone: stop.contactPhone,
            shipments: stop.shipmentIds
              ? {
                  connect: stop.shipmentIds.map((id) => ({ id })),
                }
              : undefined,
          })),
        },
      },
      select: {
        id: true,
        routeNumber: true,
        status: true,
        vehicleId: true,
        vehicleType: true,
        driverId: true,
        driverName: true,
        totalDistance: true,
        totalDuration: true,
        distanceUnit: true,
        plannedStartTime: true,
        plannedEndTime: true,
        totalWeight: true,
        totalVolume: true,
        totalPackages: true,
        createdAt: true,
        updatedAt: true,
        stops: {
          select: {
            id: true,
            sequenceNumber: true,
            stopType: true,
            status: true,
            street: true,
            street2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
            plannedArrivalTime: true,
            plannedDepartureTime: true,
            serviceTime: true,
            contactName: true,
            contactPhone: true,
          },
          orderBy: {
            sequenceNumber: 'asc',
          },
        },
      },
    });

    return route;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    status?: RouteStatus,
    driverId?: string,
    vehicleId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const skip = (page - 1) * pageSize;

    // Build where clause for filters
    const where: any = {};
    if (status) where.status = status;
    if (driverId) where.driverId = driverId;
    if (vehicleId) where.vehicleId = vehicleId;

    // Date range filter
    if (startDate || endDate) {
      where.plannedStartTime = {};
      if (startDate) where.plannedStartTime.gte = new Date(startDate);
      if (endDate) where.plannedStartTime.lte = new Date(endDate);
    }

    const [routes, total] = await Promise.all([
      this.prisma.route.findMany({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          routeNumber: true,
          status: true,
          vehicleId: true,
          vehicleType: true,
          vehicle: {
            select: {
              id: true,
              vehicleNumber: true,
              licensePlate: true,
              make: true,
              model: true,
            },
          },
          driverId: true,
          driverName: true,
          driver: {
            select: {
              id: true,
              driverNumber: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
          totalDistance: true,
          totalDuration: true,
          distanceUnit: true,
          plannedStartTime: true,
          plannedEndTime: true,
          actualStartTime: true,
          actualEndTime: true,
          totalWeight: true,
          totalVolume: true,
          totalPackages: true,
          isOptimized: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              stops: true,
            },
          },
        },
        orderBy: {
          plannedStartTime: 'desc',
        },
      }),
      this.prisma.route.count({ where }),
    ]);

    return {
      data: routes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({
      where: { id },
      select: {
        id: true,
        routeNumber: true,
        status: true,
        vehicleId: true,
        vehicleType: true,
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            type: true,
            licensePlate: true,
            make: true,
            model: true,
            year: true,
            color: true,
            maxWeight: true,
            maxVolume: true,
            status: true,
          },
        },
        driverId: true,
        driverName: true,
        driver: {
          select: {
            id: true,
            driverNumber: true,
            licenseNumber: true,
            status: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        totalDistance: true,
        totalDuration: true,
        distanceUnit: true,
        isOptimized: true,
        optimizedAt: true,
        optimizationScore: true,
        plannedStartTime: true,
        plannedEndTime: true,
        actualStartTime: true,
        actualEndTime: true,
        totalWeight: true,
        totalVolume: true,
        totalPackages: true,
        createdAt: true,
        updatedAt: true,
        stops: {
          select: {
            id: true,
            sequenceNumber: true,
            stopType: true,
            status: true,
            street: true,
            street2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
            plannedArrivalTime: true,
            plannedDepartureTime: true,
            actualArrivalTime: true,
            actualDepartureTime: true,
            serviceTime: true,
            completedAt: true,
            notes: true,
            contactName: true,
            contactPhone: true,
            shipments: {
              select: {
                id: true,
                referenceNumber: true,
                type: true,
                status: true,
                customerName: true,
                totalWeight: true,
                totalVolume: true,
              },
            },
          },
          orderBy: {
            sequenceNumber: 'asc',
          },
        },
      },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    // Check if route exists
    await this.findOne(id);

    const { stops, ...routeData } = updateRouteDto;

    // Verify vehicle exists if being updated
    if (routeData.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: routeData.vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with ID ${routeData.vehicleId} not found`,
        );
      }
    }

    // Verify driver exists if being updated
    if (routeData.driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: routeData.driverId },
      });
      if (!driver) {
        throw new NotFoundException(
          `Driver with ID ${routeData.driverId} not found`,
        );
      }
    }

    // Build update data
    const updateData: any = { ...routeData };

    // Convert date strings to Date objects
    if (updateData.plannedStartTime) {
      updateData.plannedStartTime = new Date(updateData.plannedStartTime);
    }
    if (updateData.plannedEndTime) {
      updateData.plannedEndTime = new Date(updateData.plannedEndTime);
    }

    // Update route (stops are handled separately if needed)
    const route = await this.prisma.route.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        routeNumber: true,
        status: true,
        vehicleId: true,
        vehicleType: true,
        driverId: true,
        driverName: true,
        totalDistance: true,
        totalDuration: true,
        distanceUnit: true,
        plannedStartTime: true,
        plannedEndTime: true,
        totalWeight: true,
        totalVolume: true,
        totalPackages: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return route;
  }

  async remove(id: string) {
    // Check if route exists
    await this.findOne(id);

    await this.prisma.route.delete({
      where: { id },
    });

    return { message: 'Route deleted successfully' };
  }

  async updateStatus(id: string, status: RouteStatus) {
    // Check if route exists
    await this.findOne(id);

    // Validate status transition
    const validStatuses = Object.values(RouteStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const updateData: any = { status };

    // Set actual start/end times based on status
    if (status === 'IN_PROGRESS' && !updateData.actualStartTime) {
      updateData.actualStartTime = new Date();
    } else if (status === 'COMPLETED' && !updateData.actualEndTime) {
      updateData.actualEndTime = new Date();
    }

    const route = await this.prisma.route.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        routeNumber: true,
        status: true,
        actualStartTime: true,
        actualEndTime: true,
        updatedAt: true,
      },
    });

    return route;
  }

  async assignDriver(routeId: string, driverId: string) {
    // Check if route exists
    await this.findOne(routeId);

    // Verify driver exists
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    // Update route with driver information
    const route = await this.prisma.route.update({
      where: { id: routeId },
      data: {
        driverId,
        driverName: `${driver.user.firstName} ${driver.user.lastName}`,
        status: 'ASSIGNED',
      },
      select: {
        id: true,
        routeNumber: true,
        status: true,
        driverId: true,
        driverName: true,
        driver: {
          select: {
            id: true,
            driverNumber: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        updatedAt: true,
      },
    });

    return route;
  }

  async assignVehicle(routeId: string, vehicleId: string) {
    // Check if route exists
    await this.findOne(routeId);

    // Verify vehicle exists
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    // Check vehicle capacity matches route requirements
    const route = await this.prisma.route.findUnique({
      where: { id: routeId },
      select: {
        totalWeight: true,
        totalVolume: true,
      },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    if (vehicle.maxWeight < route.totalWeight) {
      throw new BadRequestException(
        `Vehicle weight capacity (${vehicle.maxWeight}) is less than route total weight (${route.totalWeight})`,
      );
    }

    if (vehicle.maxVolume < route.totalVolume) {
      throw new BadRequestException(
        `Vehicle volume capacity (${vehicle.maxVolume}) is less than route total volume (${route.totalVolume})`,
      );
    }

    // Update route with vehicle
    const updatedRoute = await this.prisma.route.update({
      where: { id: routeId },
      data: {
        vehicleId,
        vehicleType: vehicle.type,
      },
      select: {
        id: true,
        routeNumber: true,
        status: true,
        vehicleId: true,
        vehicleType: true,
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            licensePlate: true,
            make: true,
            model: true,
            type: true,
            maxWeight: true,
            maxVolume: true,
          },
        },
        updatedAt: true,
      },
    });

    return updatedRoute;
  }

  async getStops(routeId: string) {
    // Check if route exists
    await this.findOne(routeId);

    const stops = await this.prisma.routeStop.findMany({
      where: { routeId },
      select: {
        id: true,
        sequenceNumber: true,
        stopType: true,
        status: true,
        street: true,
        street2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        latitude: true,
        longitude: true,
        plannedArrivalTime: true,
        plannedDepartureTime: true,
        actualArrivalTime: true,
        actualDepartureTime: true,
        serviceTime: true,
        completedAt: true,
        notes: true,
        contactName: true,
        contactPhone: true,
        shipments: {
          select: {
            id: true,
            referenceNumber: true,
            type: true,
            status: true,
            customerName: true,
            totalWeight: true,
            totalVolume: true,
            weightUnit: true,
            dimensionUnit: true,
          },
        },
      },
      orderBy: {
        sequenceNumber: 'asc',
      },
    });

    return {
      routeId,
      stops,
      totalStops: stops.length,
    };
  }

  async generateRouteNumber(): Promise<string> {
    const prefix = 'RTE';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get count of routes created today
    const startOfDay = new Date(year, date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(year, date.getMonth(), date.getDate(), 23, 59, 59);

    const count = await this.prisma.route.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${year}${month}${day}-${sequence}`;
  }
}
