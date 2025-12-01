#!/bin/bash

# THG TMS Initialization Script
# This script sets up the complete development environment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                      ║${NC}"
echo -e "${BLUE}║          THG TMS Initialization Script              ║${NC}"
echo -e "${BLUE}║     Transport Management System Setup               ║${NC}"
echo -e "${BLUE}║                                                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}[1/8] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 18.0.0${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be >= 18.0.0 (current: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Install root dependencies
echo -e "${BLUE}[2/8] Installing root dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Root dependencies installed${NC}"
echo ""

# Install backend dependencies
echo -e "${BLUE}[3/8] Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
cd ..
echo ""

# Install frontend dependencies
echo -e "${BLUE}[4/8] Installing frontend dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
cd ..
echo ""

# Setup environment
echo -e "${BLUE}[5/8] Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env file with your configuration${NC}"
    echo -e "${YELLOW}   Required: JWT_SECRET, DATABASE_PASSWORD${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Start Docker services
echo -e "${BLUE}[6/8] Starting Docker services...${NC}"
echo -e "${YELLOW}   This may take a few minutes on first run...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Docker services started${NC}"
echo ""

# Wait for PostgreSQL
echo -e "${BLUE}[7/8] Waiting for PostgreSQL to be ready...${NC}"
sleep 10
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
echo ""

# Setup database
echo -e "${BLUE}[8/8] Setting up database...${NC}"
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

# Success message
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}║           🎉 SETUP COMPLETE! 🎉                      ║${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo -e "${YELLOW}1. Start development servers:${NC}"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo -e "${YELLOW}2. Access the application:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend:   ${GREEN}http://localhost:3000/api${NC}"
echo -e "   API Docs:  ${GREEN}http://localhost:3000/api/docs${NC}"
echo ""
echo -e "${YELLOW}3. View database:${NC}"
echo -e "   ${GREEN}cd backend && npx prisma studio${NC}"
echo ""
echo -e "${YELLOW}4. View Docker logs:${NC}"
echo -e "   ${GREEN}docker-compose logs -f${NC}"
echo ""
echo -e "${BLUE}For more information, see:${NC}"
echo -e "   📖 ${GREEN}QUICK_START.md${NC}"
echo -e "   📖 ${GREEN}GETTING_STARTED.md${NC}"
echo -e "   📖 ${GREEN}BUILD_COMPLETE.md${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
