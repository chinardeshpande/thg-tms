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
} from '@nestjs/swagger';
import { ShipmentsService } from '../services/shipments.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ShipmentStatus, ShipmentType } from '@prisma/client';

@ApiTags('shipments')
@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, description: 'Shipment created successfully' })
  @ApiResponse({ status: 409, description: 'Shipment already exists' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.create(createShipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipments with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ShipmentStatus,
    description: 'Filter by shipment status',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ShipmentType,
    description: 'Filter by shipment type',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: String,
    description: 'Filter by customer ID',
  })
  @ApiResponse({ status: 200, description: 'Shipments retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: ShipmentStatus,
    @Query('type') type?: ShipmentType,
    @Query('customerId') customerId?: string,
  ) {
    return this.shipmentsService.findAll(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      status,
      type,
      customerId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({
    name: 'id',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment retrieved successfully with packages, documents, and tracking events',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  findOne(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get tracking events for a shipment' })
  @ApiParam({
    name: 'id',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking events retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  getTracking(@Param('id') id: string) {
    return this.shipmentsService.getTracking(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shipment' })
  @ApiParam({
    name: 'id',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  update(
    @Param('id') id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.shipmentsService.update(id, updateShipmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update shipment status' })
  @ApiParam({
    name: 'id',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ShipmentStatus,
  ) {
    return this.shipmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shipment' })
  @ApiParam({
    name: 'id',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Shipment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  remove(@Param('id') id: string) {
    return this.shipmentsService.remove(id);
  }
}
