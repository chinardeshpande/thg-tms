import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from '@prisma/client';

export class CreateCompanyDto {
  @ApiProperty({ example: 'THG Logistics Ltd.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'THG-12345' })
  @IsString()
  businessId: string;

  @ApiProperty({ example: 'TAX-67890' })
  @IsString()
  taxId: string;

  @ApiProperty({ example: 'contact@thglogistics.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+44 20 1234 5678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://www.thglogistics.com', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: '123 Business Street' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Suite 100', required: false })
  @IsString()
  @IsOptional()
  street2?: string;

  @ApiProperty({ example: 'London' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Greater London' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'SW1A 1AA' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'United Kingdom' })
  @IsString()
  country: string;

  @ApiProperty({ example: 51.5074, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -0.1278, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ enum: CompanyStatus, default: 'PENDING' })
  @IsEnum(CompanyStatus)
  @IsOptional()
  status?: CompanyStatus;
}
