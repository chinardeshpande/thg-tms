import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarrierType, CarrierStatus } from '@prisma/client';

export class CreateCarrierDto {
  @ApiProperty({ example: 'DHL', description: 'Unique carrier code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'DHL Express', description: 'Carrier name' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: CarrierType,
    example: 'COURIER',
    description: 'Type of carrier service',
  })
  @IsEnum(CarrierType)
  type: CarrierType;

  @ApiProperty({
    example: 'contact@dhl.com',
    description: 'Carrier contact email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+44 20 7946 0958',
    description: 'Carrier contact phone',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'https://www.dhl.com',
    required: false,
    description: 'Carrier website URL',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    example: 'https://api.dhl.com/v1',
    required: false,
    description: 'API endpoint for carrier integration',
  })
  @IsString()
  @IsOptional()
  apiEndpoint?: string;

  @ApiProperty({
    example: 'api_key_123456789',
    required: false,
    description: 'API key for carrier integration',
  })
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiProperty({
    enum: CarrierStatus,
    default: 'ACTIVE',
    required: false,
    description: 'Carrier status',
  })
  @IsEnum(CarrierStatus)
  @IsOptional()
  status?: CarrierStatus;
}
