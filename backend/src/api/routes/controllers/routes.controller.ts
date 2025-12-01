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
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoutesService } from '../services/routes.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RouteStatus } from '@prisma/client';

@ApiTags('routes')
@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new route with stops' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  @ApiResponse({ status: 409, description: 'Route already exists' })
  @ApiResponse({ status: 404, description: 'Vehicle or driver not found' })
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RouteStatus,
    description: 'Filter by route status',
  })
  @ApiQuery({
    name: 'driverId',
    required: false,
    type: String,
    description: 'Filter by assigned driver ID',
  })
  @ApiQuery({
    name: 'vehicleId',
    required: false,
    type: String,
    description: 'Filter by assigned vehicle ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter by planned start date (ISO 8601 format)',
    example: '2024-12-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter by planned end date (ISO 8601 format)',
    example: '2024-12-31T23:59:59Z',
  })
  @ApiResponse({ status: 200, description: 'Routes retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: RouteStatus,
    @Query('driverId') driverId?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.routesService.findAll(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      status,
      driverId,
      vehicleId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Route retrieved successfully with stops, shipments, and packages',
  })
  @ApiResponse({ status: 404, description: 'Route not found' })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Get(':id/stops')
  @ApiOperation({ summary: 'Get all stops for a route' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Route stops retrieved successfully with shipments and packages',
  })
  @ApiResponse({ status: 404, description: 'Route not found' })
  getStops(@Param('id') id: string) {
    return this.routesService.getStops(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update route' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Route updated successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update route status' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(RouteStatus),
          example: RouteStatus.IN_PROGRESS,
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Route status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  updateStatus(@Param('id') id: string, @Body('status') status: RouteStatus) {
    return this.routesService.updateStatus(id, status);
  }

  @Post(':id/assign-driver')
  @ApiOperation({ summary: 'Assign driver to route' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        driverId: {
          type: 'string',
          example: 'driver-id-123',
        },
      },
      required: ['driverId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Driver assigned to route successfully',
  })
  @ApiResponse({ status: 404, description: 'Route or driver not found' })
  assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.routesService.assignDriver(id, driverId);
  }

  @Post(':id/assign-vehicle')
  @ApiOperation({ summary: 'Assign vehicle to route' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vehicleId: {
          type: 'string',
          example: 'vehicle-id-123',
        },
      },
      required: ['vehicleId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle assigned to route successfully',
  })
  @ApiResponse({ status: 404, description: 'Route or vehicle not found' })
  @ApiResponse({
    status: 400,
    description: 'Vehicle capacity insufficient for route',
  })
  assignVehicle(
    @Param('id') id: string,
    @Body('vehicleId') vehicleId: string,
  ) {
    return this.routesService.assignVehicle(id, vehicleId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete route' })
  @ApiParam({
    name: 'id',
    description: 'Route ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Route deleted successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
