import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  ValidateNested,
  Min,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ShipmentType,
  ShipmentPriority,
  ServiceLevel,
  WeightUnit,
  DimensionUnit,
} from '@prisma/client';

export class AddressDto {
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
}

export class CreateShipmentDto {
  @ApiProperty({
    example: 'SHP-2024-001',
    required: false,
    description: 'Auto-generated if not provided',
  })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({
    enum: ShipmentType,
    example: ShipmentType.OUTBOUND,
    description: 'Type of shipment',
  })
  @IsEnum(ShipmentType)
  type: ShipmentType;

  @ApiProperty({
    enum: ShipmentPriority,
    example: ShipmentPriority.MEDIUM,
    default: ShipmentPriority.MEDIUM,
  })
  @IsEnum(ShipmentPriority)
  @IsOptional()
  priority?: ShipmentPriority;

  @ApiProperty({
    enum: ServiceLevel,
    example: ServiceLevel.STANDARD,
    default: ServiceLevel.STANDARD,
  })
  @IsEnum(ServiceLevel)
  @IsOptional()
  serviceLevel?: ServiceLevel;

  @ApiProperty({
    type: AddressDto,
    description: 'Origin address details',
  })
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @ApiProperty({
    type: AddressDto,
    description: 'Destination address details',
  })
  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @ApiProperty({
    example: 'cuid123456789',
    description: 'Customer company ID',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({
    example: '+44 20 1234 5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiProperty({
    example: 25.5,
    description: 'Total weight of the shipment',
  })
  @IsNumber()
  @Min(0)
  totalWeight: number;

  @ApiProperty({
    example: 1.5,
    description: 'Total volume of the shipment',
  })
  @IsNumber()
  @Min(0)
  totalVolume: number;

  @ApiProperty({
    enum: WeightUnit,
    example: WeightUnit.KG,
    default: WeightUnit.KG,
  })
  @IsEnum(WeightUnit)
  @IsOptional()
  weightUnit?: WeightUnit;

  @ApiProperty({
    enum: DimensionUnit,
    example: DimensionUnit.CM,
    default: DimensionUnit.CM,
  })
  @IsEnum(DimensionUnit)
  @IsOptional()
  dimensionUnit?: DimensionUnit;

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    required: false,
    description: 'Scheduled pickup date and time',
  })
  @IsDateString()
  @IsOptional()
  scheduledPickupDate?: string;

  @ApiProperty({
    example: '2024-12-03T16:00:00Z',
    required: false,
    description: 'Estimated delivery date and time',
  })
  @IsDateString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @ApiProperty({
    example: 1000.0,
    required: false,
    description: 'Declared value of the shipment',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  declaredValue?: number;

  @ApiProperty({
    example: 'GBP',
    default: 'GBP',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    example: false,
    default: false,
    required: false,
    description: 'Whether signature is required on delivery',
  })
  @IsBoolean()
  @IsOptional()
  requiresSignature?: boolean;

  @ApiProperty({
    example: false,
    default: false,
    required: false,
    description: 'Whether shipment contains hazardous materials',
  })
  @IsBoolean()
  @IsOptional()
  isHazmat?: boolean;

  @ApiProperty({
    example: false,
    default: false,
    required: false,
    description: 'Whether shipment contains fragile items',
  })
  @IsBoolean()
  @IsOptional()
  isFragile?: boolean;

  @ApiProperty({
    example: 'Handle with care. Delivery before 3 PM.',
    required: false,
    description: 'Special instructions for the carrier',
  })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}
