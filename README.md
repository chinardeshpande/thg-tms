# THG Ingenuity Transport Management System (TMS)

## Overview
Enterprise-grade SaaS Transport Management System designed for global logistics operations across UK, EU, US, and APAC markets. Integrates IoT, Blockchain, AI, and THG's existing platforms (WHP, Voyager, WCS, THG Delivered) as modular plug-ins.

## Key Features
- **Multi-Region Support**: First-mile, middle-mile, and last-mile logistics
- **AI-Powered Optimization**: Route planning and ETA prediction
- **Blockchain Audit Trail**: Immutable tracking ledger
- **IoT Integration**: Real-time GPS and telemetry
- **Multi-Carrier Management**: Digital tendering and rate management
- **Advanced Analytics**: SLA monitoring and cost optimization

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS (THG Ingenuity theme)
- Redux Toolkit for state management
- React Query for API calls
- Recharts for analytics visualization

### Backend
- Node.js with NestJS framework
- Python microservices for AI/ML
- PostgreSQL (primary database)
- Redis (caching and sessions)
- MongoDB (IoT telemetry data)
- Apache Kafka (event streaming)
- MQTT (IoT device gateway)

### AI & Optimization
- Google OR-Tools (route optimization)
- scikit-learn (predictive analytics)
- TensorFlow.js (client-side predictions)

### Blockchain
- Polygon Edge / Hyperledger Sawtooth
- Smart contracts for audit trail

### Infrastructure
- Docker & Docker Compose
- Kubernetes (Azure AKS)
- Terraform (IaC)
- GitHub Actions (CI/CD)

## Project Structure

```
thg-tms/
├── backend/              # NestJS API services
├── frontend/             # React application
├── database/             # Migrations and seeds
├── docs/                 # Documentation
├── infrastructure/       # Docker, K8s, Terraform
└── shared/              # Shared types and utilities
```

## Modules

### Core Modules
1. **Customer Onboarding** - Multi-step registration and approval
2. **Authentication & Access** - OAuth2/JWT with MFA
3. **Shipment Management** - Create, track, and manage shipments
4. **Route & Load Optimization** - AI-powered planning
5. **Carrier & Fleet Integration** - Multi-carrier management
6. **Dispatch & Labeling** - Label generation and vehicle assignment
7. **Tracking & Visibility** - Real-time IoT tracking with blockchain
8. **Returns & Reverse Logistics** - RMA and return processing
9. **Cost, Billing & Audit** - Rate calculation and reconciliation
10. **Analytics & SLA Dashboards** - Performance metrics and insights

### Integration Points
- THG Voyager (WMS)
- THG WHP (Warehouse Platform)
- THG WCS (Warehouse Control System)
- THG Delivered (Delivery Service)
- External Carriers (DHL, DPD, FedEx, etc.)
- Finance Systems (ERP integration)

## User Roles
- **Admin** - Full system access
- **Logistics Manager** - Operations management
- **Carrier Operator** - Carrier-specific operations
- **Fleet Manager** - Fleet and vehicle management
- **Client User** - Read-only dashboard and tracking

## Development Phases

### Phase 1: Core Framework (Weeks 1-3)
- Authentication and user roles
- Shipment CRUD operations
- Mock label generation
- Basic UI framework

### Phase 2: Dispatch + AI Planning (Weeks 4-6)
- Route/load optimizer
- Dispatch console
- IoT integration foundation

### Phase 3: Tracking, Billing & SLA (Weeks 7-9)
- SLA monitoring engine
- Finance API integration
- Invoice reconciliation

### Phase 4: External Client Mode (Weeks 10-12)
- Portal theming
- Role-based filtering
- Self-service APIs

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- MongoDB 6+
- Docker & Docker Compose

### Installation

```bash
# Clone repository
git clone <repository-url>
cd thg-tms

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env

# Start development environment
docker-compose up -d

# Run migrations
npm run migrate

# Start development servers
npm run dev
```

## API Documentation
API documentation available at `/api/docs` when running in development mode.

## Contributing
Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## License
Proprietary - THG Ingenuity © 2025

## Support
For support, email tms-support@thg.com or create an issue in the project repository.
