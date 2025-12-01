import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    example: 'cuid1234567890',
    description: 'Shipment ID',
  })
  @IsString()
  @IsNotEmpty()
  shipmentId: string;

  @ApiProperty({
    example: 100.0,
    description: 'Subtotal amount before tax',
  })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({
    example: 20.0,
    description: 'Tax amount',
  })
  @IsNumber()
  @Min(0)
  tax: number;

  @ApiProperty({
    example: 120.0,
    description: 'Total amount including tax',
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({
    example: 'GBP',
    default: 'GBP',
    description: 'Currency code',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    example: '2024-12-15T00:00:00Z',
    description: 'Due date for payment',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    example: 'INV-2024-001',
    required: false,
    description: 'Invoice number (auto-generated if not provided)',
  })
  @IsString()
  @IsOptional()
  invoiceNumber?: string;
}
