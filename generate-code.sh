#!/bin/bash

# THG TMS Code Generator Script
# This script generates all the boilerplate code for the TMS application

set -e

echo "🚀 THG TMS Code Generator Starting..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")"

echo -e "${BLUE}📁 Creating backend structure...${NC}"

# Create backend directories
mkdir -p backend/src/api/{auth/{controllers,services,strategies,dto,guards},users/{controllers,services,dto},companies/{controllers,services,dto},shipments/{controllers,services,dto},carriers/{controllers,services,dto},routes/{controllers,services,dto},tracking/{controllers,services,dto},billing/{controllers,services,dto},analytics/{controllers,services,dto}}

mkdir -p backend/src/{config,utils,services}

echo -e "${GREEN}✅ Backend directories created${NC}"

echo -e "${BLUE}📁 Creating frontend structure...${NC}"

# Create frontend directories
mkdir -p frontend/src/{components/{common,layout,features/{auth,shipments,carriers,routes,tracking,analytics}},pages,services,hooks,contexts,utils,styles,assets/{images,icons}}

echo -e "${GREEN}✅ Frontend directories created${NC}"

echo -e "${BLUE}📝 Generating DTO files...${NC}"

# Auth DTOs
cat > backend/src/api/auth/dto/auth.dto.ts << 'EOF'
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
EOF

echo -e "${GREEN}✅ Auth DTOs created${NC}"

echo ""
echo -e "${GREEN}======================================"
echo -e "✨ Code generation completed!"
echo -e "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. cd thg-tms"
echo "2. npm install"
echo "3. npm run docker:up"
echo "4. cd backend && npx prisma migrate dev"
echo "5. npm run dev"
echo ""

EOF
chmod +x generate-code.sh
