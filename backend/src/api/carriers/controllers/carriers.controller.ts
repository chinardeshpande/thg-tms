import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CarriersService } from '../services/carriers.service';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CarrierType, CarrierStatus } from '@prisma/client';

@ApiTags('carriers')
@Controller('carriers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new carrier' })
  @ApiResponse({ status: 201, description: 'Carrier created successfully' })
  @ApiResponse({ status: 409, description: 'Carrier already exists' })
  create(@Body() createCarrierDto: CreateCarrierDto) {
    return this.carriersService.create(createCarrierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carriers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CarrierType,
    description: 'Filter by carrier type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: CarrierStatus,
    description: 'Filter by carrier status',
  })
  @ApiResponse({ status: 200, description: 'Carriers retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('type') type?: CarrierType,
    @Query('status') status?: CarrierStatus,
  ) {
    return this.carriersService.findAll(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      type,
      status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get carrier by ID' })
  @ApiResponse({ status: 200, description: 'Carrier retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
  findOne(@Param('id') id: string) {
    return this.carriersService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get carrier services' })
  @ApiResponse({
    status: 200,
    description: 'Carrier services retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
  getServices(@Param('id') id: string) {
    return this.carriersService.getServices(id);
  }

  @Get(':id/rates')
  @ApiOperation({ summary: 'Get carrier rates' })
  @ApiResponse({
    status: 200,
    description: 'Carrier rates retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
  getRates(@Param('id') id: string) {
    return this.carriersService.getRates(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update carrier' })
  @ApiResponse({ status: 200, description: 'Carrier updated successfully' })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
  update(@Param('id') id: string, @Body() updateCarrierDto: UpdateCarrierDto) {
    return this.carriersService.update(id, updateCarrierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete carrier' })
  @ApiResponse({ status: 200, description: 'Carrier deleted successfully' })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
  remove(@Param('id') id: string) {
    return this.carriersService.remove(id);
  }
}
