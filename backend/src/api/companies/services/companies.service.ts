import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { businessId, email, ...rest } = createCompanyDto;

    // Check if company with businessId already exists
    const existingCompanyByBusinessId = await this.prisma.company.findUnique({
      where: { businessId },
    });

    if (existingCompanyByBusinessId) {
      throw new ConflictException(
        'Company with this business ID already exists',
      );
    }

    // Check if company with email already exists
    const existingCompanyByEmail = await this.prisma.company.findFirst({
      where: { email },
    });

    if (existingCompanyByEmail) {
      throw new ConflictException(
        'Company with this email already exists',
      );
    }

    // Create company
    const company = await this.prisma.company.create({
      data: {
        businessId,
        email,
        ...rest,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return company;
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.company.count(),
    ]);

    return {
      data: companies,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Check if company exists
    await this.findOne(id);

    const { businessId, email, ...rest } = updateCompanyDto;

    // If updating businessId, check if it's already taken
    if (businessId) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { businessId },
      });

      if (existingCompany && existingCompany.id !== id) {
        throw new ConflictException('Business ID already in use');
      }
    }

    // If updating email, check if it's already taken
    if (email) {
      const existingCompany = await this.prisma.company.findFirst({
        where: { email },
      });

      if (existingCompany && existingCompany.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: any = { ...rest };
    if (businessId) data.businessId = businessId;
    if (email) data.email = email;

    const company = await this.prisma.company.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return company;
  }

  async remove(id: string) {
    // Check if company exists
    await this.findOne(id);

    await this.prisma.company.delete({
      where: { id },
    });

    return { message: 'Company deleted successfully' };
  }
}
