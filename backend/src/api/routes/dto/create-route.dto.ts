import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleType, StopType } from '@prisma/client';

export class CreateRouteStopDto {
  @ApiProperty({ example: 1, description: 'Sequence number of the stop in the route' })
  @IsInt()
  @Min(1)
  sequenceNumber: number;

  @ApiProperty({
    enum: StopType,
    example: StopType.DELIVERY,
    description: 'Type of stop (PICKUP, DELIVERY, or PICKUP_AND_DELIVERY)',
  })
  @IsEnum(StopType)
  stopType: StopType;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Suite 100', required: false })
  @IsString()
  @IsOptional()
  street2?: string;

  @ApiProperty({ example: 'London' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'England' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'SW1A 1AA' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'United Kingdom' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 51.5074, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -0.1278, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    description: 'Planned arrival time at this stop',
  })
  @IsDateString()
  plannedArrivalTime: string;

  @ApiProperty({
    example: '2024-12-01T10:30:00Z',
    description: 'Planned departure time from this stop',
  })
  @IsDateString()
  plannedDepartureTime: string;

  @ApiProperty({
    example: 30,
    description: 'Estimated service time at this stop in minutes',
  })
  @IsInt()
  @Min(0)
  serviceTime: number;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({ example: '+44 20 1234 5678', required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({
    example: ['shipment-id-1', 'shipment-id-2'],
    required: false,
    description: 'Array of shipment IDs associated with this stop',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  shipmentIds?: string[];

  @ApiProperty({
    example: ['package-id-1', 'package-id-2'],
    required: false,
    description: 'Array of package IDs associated with this stop',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  packageIds?: string[];
}

export class CreateRouteDto {
  @ApiProperty({
    example: 'RTE-20241201-0001',
    required: false,
    description: 'Auto-generated if not provided (format: RTE-YYYYMMDD-XXXX)',
  })
  @IsString()
  @IsOptional()
  routeNumber?: string;

  @ApiProperty({
    example: 'vehicle-id-123',
    required: false,
    description: 'ID of the assigned vehicle',
  })
  @IsString()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({
    enum: VehicleType,
    example: VehicleType.VAN,
    description: 'Type of vehicle required for this route',
  })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({
    example: 'driver-id-123',
    required: false,
    description: 'ID of the assigned driver',
  })
  @IsString()
  @IsOptional()
  driverId?: string;

  @ApiProperty({
    example: 'John Smith',
    required: false,
    description: 'Name of the assigned driver',
  })
  @IsString()
  @IsOptional()
  driverName?: string;

  @ApiProperty({
    example: 125.5,
    description: 'Total distance of the route',
  })
  @IsNumber()
  @Min(0)
  totalDistance: number;

  @ApiProperty({
    example: 480,
    description: 'Total duration of the route in minutes',
  })
  @IsNumber()
  @Min(0)
  totalDuration: number;

  @ApiProperty({
    example: 'km',
    default: 'km',
    description: 'Unit of distance measurement',
  })
  @IsString()
  @IsOptional()
  distanceUnit?: string;

  @ApiProperty({
    example: '2024-12-01T08:00:00Z',
    description: 'Planned start time for the route',
  })
  @IsDateString()
  plannedStartTime: string;

  @ApiProperty({
    example: '2024-12-01T18:00:00Z',
    description: 'Planned end time for the route',
  })
  @IsDateString()
  plannedEndTime: string;

  @ApiProperty({
    example: 500.5,
    description: 'Total weight of all shipments in the route',
  })
  @IsNumber()
  @Min(0)
  totalWeight: number;

  @ApiProperty({
    example: 15.5,
    description: 'Total volume of all shipments in the route',
  })
  @IsNumber()
  @Min(0)
  totalVolume: number;

  @ApiProperty({
    example: 25,
    description: 'Total number of packages in the route',
  })
  @IsInt()
  @Min(0)
  totalPackages: number;

  @ApiProperty({
    type: [CreateRouteStopDto],
    description: 'Array of stops in the route',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRouteStopDto)
  @IsArray()
  stops: CreateRouteStopDto[];
}
