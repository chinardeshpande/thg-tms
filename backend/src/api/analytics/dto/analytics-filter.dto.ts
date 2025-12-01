import {
  IsDateString,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus, ShipmentType, CarrierType } from '@prisma/client';

export class AnalyticsFilterDto {
  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    required: false,
    description: 'Start date for analytics period',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    required: false,
    description: 'End date for analytics period',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    example: ['UK', 'EU'],
    required: false,
    description: 'Filter by regions',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  regions?: string[];

  @ApiProperty({
    example: ['carrier123', 'carrier456'],
    required: false,
    description: 'Filter by carrier IDs',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  carriers?: string[];

  @ApiProperty({
    example: ['OUTBOUND', 'INBOUND'],
    required: false,
    description: 'Filter by shipment types',
    enum: ShipmentType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(ShipmentType, { each: true })
  @IsOptional()
  shipmentTypes?: ShipmentType[];

  @ApiProperty({
    example: ['DELIVERED', 'IN_TRANSIT'],
    required: false,
    description: 'Filter by shipment statuses',
    enum: ShipmentStatus,
    isArray: true,
  })
  @IsArray()
  @IsEnum(ShipmentStatus, { each: true })
  @IsOptional()
  statuses?: ShipmentStatus[];

  @ApiProperty({
    example: ['customer123'],
    required: false,
    description: 'Filter by customer IDs',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customers?: string[];
}
