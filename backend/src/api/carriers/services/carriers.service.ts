import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { CarrierType, CarrierStatus } from '@prisma/client';

@Injectable()
export class CarriersService {
  constructor(private prisma: PrismaService) {}

  async create(createCarrierDto: CreateCarrierDto, companyId: string) {
    const { code, ...rest } = createCarrierDto;

    // Check if carrier with code already exists
    const existingCarrier = await this.prisma.carrier.findUnique({
      where: { code },
    });

    if (existingCarrier) {
      throw new ConflictException(
        'Carrier with this code already exists',
      );
    }

    // Create carrier
    const carrier = await this.prisma.carrier.create({
      data: {
        code,
        companyId,
        ...rest,
      },
      include: {
        _count: {
          select: {
            services: true,
            rates: true,
            shipments: true,
          },
        },
      },
    });

    return carrier;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    type?: CarrierType,
    status?: CarrierStatus,
  ) {
    const skip = (page - 1) * pageSize;

    // Build where clause based on filters
    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }

    const [carriers, total] = await Promise.all([
      this.prisma.carrier.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              services: true,
              rates: true,
              shipments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.carrier.count({ where }),
    ]);

    return {
      data: carriers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const carrier = await this.prisma.carrier.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: {
            code: 'asc',
          },
        },
        rates: {
          where: {
            isActive: true,
          },
          orderBy: {
            effectiveFrom: 'desc',
          },
        },
        _count: {
          select: {
            services: true,
            rates: true,
            contracts: true,
            shipments: true,
          },
        },
      },
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    return carrier;
  }

  async update(id: string, updateCarrierDto: UpdateCarrierDto) {
    // Check if carrier exists
    await this.findOne(id);

    const { code, ...rest } = updateCarrierDto;

    // If updating code, check if it's already taken
    if (code) {
      const existingCarrier = await this.prisma.carrier.findUnique({
        where: { code },
      });

      if (existingCarrier && existingCarrier.id !== id) {
        throw new ConflictException('Carrier code already in use');
      }
    }

    const data: any = { ...rest };
    if (code) data.code = code;

    const carrier = await this.prisma.carrier.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            services: true,
            rates: true,
            shipments: true,
          },
        },
      },
    });

    return carrier;
  }

  async remove(id: string) {
    // Check if carrier exists
    await this.findOne(id);

    await this.prisma.carrier.delete({
      where: { id },
    });

    return { message: 'Carrier deleted successfully' };
  }

  async getServices(carrierId: string) {
    // Check if carrier exists
    await this.findOne(carrierId);

    const services = await this.prisma.carrierService.findMany({
      where: { carrierId },
      orderBy: {
        code: 'asc',
      },
    });

    return services;
  }

  async getRates(carrierId: string) {
    // Check if carrier exists
    await this.findOne(carrierId);

    const rates = await this.prisma.carrierRate.findMany({
      where: { carrierId },
      orderBy: [
        { effectiveFrom: 'desc' },
        { originZone: 'asc' },
        { destinationZone: 'asc' },
      ],
    });

    return rates;
  }
}
