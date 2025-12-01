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
import { BillingService } from '../services/billing.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { InvoiceStatus } from '@prisma/client';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 409, description: 'Invoice already exists' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.billingService.create(createInvoiceDto);
  }

  @Post('generate/:shipmentId')
  @ApiOperation({
    summary: 'Generate invoice for a shipment',
    description:
      'Automatically generates an invoice based on shipment costs',
  })
  @ApiParam({
    name: 'shipmentId',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 201,
    description: 'Invoice generated successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 409, description: 'Invoice already exists for this shipment' })
  generateInvoice(@Param('shipmentId') shipmentId: string) {
    return this.billingService.generateInvoice(shipmentId);
  }

  @Post('calculate-cost')
  @ApiOperation({
    summary: 'Calculate cost for shipment',
    description:
      'Calculate estimated costs based on shipment parameters',
  })
  @ApiBody({
    description: 'Shipment parameters for cost calculation',
    schema: {
      type: 'object',
      properties: {
        weight: { type: 'number', example: 25.5 },
        volume: { type: 'number', example: 1.5 },
        distance: { type: 'number', example: 150 },
        serviceLevel: { type: 'string', example: 'EXPRESS' },
        isHazmat: { type: 'boolean', example: false },
        isFragile: { type: 'boolean', example: false },
        requiresSignature: { type: 'boolean', example: true },
        declaredValue: { type: 'number', example: 1000 },
      },
      required: ['weight', 'volume'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cost calculation completed successfully',
  })
  calculateCost(
    @Body()
    shipmentData: {
      weight: number;
      volume: number;
      distance?: number;
      serviceLevel?: string;
      isHazmat?: boolean;
      isFragile?: boolean;
      requiresSignature?: boolean;
      declaredValue?: number;
    },
  ) {
    return this.billingService.calculateCost(shipmentData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: InvoiceStatus,
    description: 'Filter by invoice status',
  })
  @ApiQuery({
    name: 'shipmentId',
    required: false,
    type: String,
    description: 'Filter by shipment ID',
  })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: InvoiceStatus,
    @Query('shipmentId') shipmentId?: string,
  ) {
    return this.billingService.findAll(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      status,
      shipmentId,
    );
  }

  @Get('shipment/:shipmentId')
  @ApiOperation({ summary: 'Get all invoices for a shipment' })
  @ApiParam({
    name: 'shipmentId',
    description: 'Shipment ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices for shipment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  getByShipment(@Param('shipmentId') shipmentId: string) {
    return this.billingService.getByShipment(shipmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice retrieved successfully with shipment details',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.billingService.update(id, updateInvoiceDto);
  }

  @Patch(':id/pay')
  @ApiOperation({
    summary: 'Mark invoice as paid',
    description: 'Updates invoice status to PAID and records payment timestamp',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice marked as paid successfully',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 400, description: 'Invoice is already paid or cannot be paid' })
  markAsPaid(@Param('id') id: string) {
    return this.billingService.markAsPaid(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 'cuid1234567890',
  })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  remove(@Param('id') id: string) {
    return this.billingService.remove(id);
  }
}
