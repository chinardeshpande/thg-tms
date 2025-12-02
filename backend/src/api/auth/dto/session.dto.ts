import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  @IsString()
  ipAddress: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;
}

export class SessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty({ required: false })
  userAgent?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date;
}

export class ListSessionsResponseDto {
  @ApiProperty({ type: [SessionResponseDto] })
  sessions: SessionResponseDto[];

  @ApiProperty()
  total: number;
}

export class RevokeSessionDto {
  @ApiProperty()
  @IsString()
  sessionId: string;
}

export class RevokeAllSessionsDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  exceptCurrent?: boolean;
}
