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
import { TrackingService } from '../services/tracking.service';
import { CreateTrackingDto } from '../dto/create-tracking.dto';
import { UpdateTrackingDto } from '../dto/update-tracking.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ShipmentStatus } from '@prisma/client';

@ApiTags('tracking')
@Controller('tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tracking event' })
  @ApiResponse({
    status: 201,
    description: 'Tracking event created successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment or package not found' })
  create(@Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingService.create(createTrackingDto);
  }

  @Post('event')
  @ApiOperation({ summary: 'Create a tracking event (alias)' })
  @ApiResponse({
    status: 201,
    description: 'Tracking event created successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment or package not found' })
  createEvent(@Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingService.createEvent(createTrackingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracking events with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'shipmentId',
    required: false,
    type: String,
    description: 'Filter by shipment ID',
  })
  @ApiQuery({
    name: 'packageId',
    required: false,
    type: String,
    description: 'Filter by package ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ShipmentStatus,
    description: 'Filter by shipment status',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking events retrieved successfully',
  })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('shipmentId') shipmentId?: string,
    @Query('packageId') packageId?: string,
    @Query('status') status?: ShipmentStatus,
  ) {
    return this.trackingService.findAll(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      shipmentId,
      packageId,
      status,
    );
  }

  @Get('shipment/:shipmentId')
  @ApiOperation({ summary: 'Get all tracking events for a shipment' })
  @ApiParam({
    name: 'shipmentId',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking events for shipment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  getByShipment(@Param('shipmentId') shipmentId: string) {
    return this.trackingService.getByShipment(shipmentId);
  }

  @Get('package/:packageId')
  @ApiOperation({ summary: 'Get all tracking events for a package' })
  @ApiParam({
    name: 'packageId',
    description: 'Package ID',
    example: 'pkg123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking events for package retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Package not found' })
  getByPackage(@Param('packageId') packageId: string) {
    return this.trackingService.getByPackage(packageId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tracking event by ID' })
  @ApiParam({
    name: 'id',
    description: 'Tracking event ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking event retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Tracking event not found' })
  findOne(@Param('id') id: string) {
    return this.trackingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tracking event' })
  @ApiParam({
    name: 'id',
    description: 'Tracking event ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking event updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Tracking event not found' })
  update(
    @Param('id') id: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.trackingService.update(id, updateTrackingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tracking event' })
  @ApiParam({
    name: 'id',
    description: 'Tracking event ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking event deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Tracking event not found' })
  remove(@Param('id') id: string) {
    return this.trackingService.remove(id);
  }
}
