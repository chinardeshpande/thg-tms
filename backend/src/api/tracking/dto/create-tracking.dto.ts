import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ShipmentStatus, FacilityType } from '@prisma/client';

export class TrackingLocationDto {
  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'London', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'England', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'United Kingdom', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 51.5074, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -0.1278, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: 'Central Distribution Center', required: false })
  @IsString()
  @IsOptional()
  facility?: string;

  @ApiProperty({
    enum: FacilityType,
    required: false,
    example: FacilityType.DISTRIBUTION_CENTER,
  })
  @IsEnum(FacilityType)
  @IsOptional()
  facilityType?: FacilityType;
}

export class CreateTrackingDto {
  @ApiProperty({
    example: 'cuid1234567890',
    description: 'Shipment ID',
  })
  @IsString()
  @IsNotEmpty()
  shipmentId: string;

  @ApiProperty({
    example: 'pkg123456',
    required: false,
    description: 'Package ID (optional for package-level tracking)',
  })
  @IsString()
  @IsOptional()
  packageId?: string;

  @ApiProperty({
    enum: ShipmentStatus,
    example: ShipmentStatus.IN_TRANSIT,
    description: 'Current shipment status',
  })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @ApiProperty({
    example: 'Shipment is in transit to destination facility',
    description: 'Tracking event description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: TrackingLocationDto,
    required: false,
    description: 'Location details for the tracking event',
  })
  @ValidateNested()
  @Type(() => TrackingLocationDto)
  @IsOptional()
  location?: TrackingLocationDto;

  @ApiProperty({
    example: '2024-12-01T14:30:00Z',
    required: false,
    description: 'Timestamp of the event (defaults to current time)',
  })
  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({
    example: { temperature: 5, humidity: 60 },
    required: false,
    description: 'Additional metadata for the tracking event',
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    example: 'user123',
    required: false,
    description: 'User who created the tracking event',
  })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
