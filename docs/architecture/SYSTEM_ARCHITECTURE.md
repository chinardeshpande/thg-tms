# THG TMS - System Architecture

## Architecture Overview

THG TMS follows a **microservices architecture** pattern with event-driven communication, designed for scalability, resilience, and modularity.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  React SPA   │  │  Mobile PWA  │  │  Admin Panel │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  API Gateway  │
                    │   (Nginx)     │
                    └───────┬───────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Backend Services                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Auth      │  │  Shipment  │  │  Carrier   │            │
│  │  Service   │  │  Service   │  │  Service   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Route     │  │  Tracking  │  │  Billing   │            │
│  │  Service   │  │  Service   │  │  Service   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  Event Bus    │
                    │   (Kafka)     │
                    └───────┬───────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ PostgreSQL │  │   Redis    │  │  MongoDB   │            │
│  │  (Main)    │  │  (Cache)   │  │   (IoT)    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  External Integrations                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ THG        │  │  Carriers  │  │ Blockchain │            │
│  │ Platforms  │  │    APIs    │  │  Network   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Redux Toolkit for state management
- React Query for server state
- Tailwind CSS for styling
- Socket.io for real-time updates

**Key Features:**
- Component-based architecture
- Code splitting and lazy loading
- Progressive Web App (PWA) capabilities
- Responsive design for all devices
- Real-time tracking updates via WebSockets

### 2. Backend Services

#### Authentication Service
**Responsibilities:**
- User authentication and authorization
- OAuth2 integration (Google, Microsoft)
- JWT token management
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)

**Tech Stack:**
- NestJS
- Passport.js
- JWT
- bcrypt

#### Shipment Service
**Responsibilities:**
- Shipment CRUD operations
- Batch import/export
- Document generation
- Label creation
- Shipment validation

**Tech Stack:**
- NestJS
- Prisma ORM
- PDFKit for label generation
- QR code generation

#### Carrier Service
**Responsibilities:**
- Carrier management
- Rate card management
- Digital tendering
- Carrier API integration
- Performance tracking

**Tech Stack:**
- NestJS
- Axios for external API calls
- EDI translation layer

#### Route Optimization Service
**Responsibilities:**
- Route planning and optimization
- Load consolidation
- Vehicle assignment
- Multi-stop route building

**Tech Stack:**
- Python (FastAPI)
- Google OR-Tools
- scikit-learn for ML predictions

#### Tracking Service
**Responsibilities:**
- Real-time location tracking
- IoT device integration
- Event processing
- ETA prediction
- Blockchain audit trail

**Tech Stack:**
- NestJS
- MQTT for IoT
- MongoDB for telemetry
- Polygon/Hyperledger for blockchain

#### Billing Service
**Responsibilities:**
- Cost calculation
- Invoice generation
- Freight reconciliation
- Payment processing

**Tech Stack:**
- NestJS
- Prisma ORM
- PDF generation

### 3. Data Architecture

#### PostgreSQL (Primary Database)
**Schema Design:**
- Users and authentication
- Companies and customers
- Shipments and packages
- Carriers and services
- Routes and vehicles
- Billing and invoices

**Key Features:**
- ACID compliance
- Complex queries and joins
- Row-level security
- Audit logging

#### Redis (Cache & Session Store)
**Usage:**
- Session management
- API response caching
- Rate limiting
- Real-time data
- Queue management (Bull)

#### MongoDB (IoT Telemetry)
**Usage:**
- GPS location data
- Sensor readings
- Event logs
- High-frequency writes
- Time-series data

### 4. Message Bus (Apache Kafka)

**Event Topics:**
- `shipment.created`
- `shipment.updated`
- `shipment.status.changed`
- `route.optimized`
- `tracking.location.updated`
- `carrier.tender.sent`
- `billing.invoice.generated`

**Benefits:**
- Decoupling services
- Event sourcing
- Replay capability
- Scalability

### 5. IoT Gateway (MQTT)

**Responsibilities:**
- Device connectivity
- Message routing
- Protocol translation
- Data validation

**Device Types:**
- GPS trackers
- Temperature sensors
- Door sensors
- Vehicle telematics

### 6. Blockchain Layer

**Purpose:**
- Immutable audit trail
- Shipment provenance
- Carrier SLA verification
- Cross-border documentation

**Technology:**
- Polygon Edge (preferred) or Hyperledger Sawtooth
- Smart contracts for automation
- Event indexing

## Integration Architecture

### THG Platform Integration

#### Voyager (WMS)
- Inventory sync
- Shipment creation triggers
- ASN/BOL generation
- Stock transfer coordination

#### WHP (Warehouse Platform)
- Label printing triggers
- Pick/pack confirmation
- Warehouse capacity planning

#### WCS (Warehouse Control System)
- Automated sorting
- Conveyor system integration
- Real-time inventory updates

#### THG Delivered
- Last-mile delivery coordination
- Driver assignment
- POD (Proof of Delivery) capture

### Carrier Integration

**Integration Methods:**
- REST APIs
- EDI (204, 214, 990)
- FTP/SFTP file exchange
- Email notifications

**Supported Carriers:**
- DHL
- DPD
- FedEx
- UPS
- Royal Mail
- Custom carriers via API

## Security Architecture

### Authentication & Authorization
- OAuth2 + JWT
- Multi-factor authentication
- Role-based access control
- API key management

### Data Security
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Database encryption
- Secrets management (HashiCorp Vault)

### Network Security
- VPC isolation
- Security groups
- WAF (Web Application Firewall)
- DDoS protection
- Rate limiting

### Compliance
- GDPR compliance
- SOC 2 Type II
- ISO 27001
- Data retention policies

## Scalability & Performance

### Horizontal Scaling
- Kubernetes pod autoscaling
- Database read replicas
- Redis clustering
- Kafka partitioning

### Caching Strategy
- Redis for API responses
- CDN for static assets
- Browser caching
- Service worker caching (PWA)

### Performance Optimization
- Database indexing
- Query optimization
- Lazy loading
- Code splitting
- Image optimization

## Monitoring & Observability

### Logging
- Centralized logging (ELK Stack)
- Structured JSON logs
- Log levels and filtering
- Correlation IDs

### Metrics
- Application metrics (Prometheus)
- Business metrics
- Custom dashboards (Grafana)

### Tracing
- Distributed tracing (Jaeger)
- Request flow tracking
- Performance bottleneck identification

### Alerting
- Automated alerts (PagerDuty)
- SLA breach notifications
- Error rate monitoring
- Resource utilization alerts

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Point-in-time recovery
- Cross-region replication
- 30-day retention

### High Availability
- Multi-AZ deployment
- Load balancing
- Failover automation
- 99.9% uptime SLA

## Deployment Architecture

### Development
- Local Docker Compose
- Hot module reloading
- Mock external services

### Staging
- Kubernetes cluster
- Separate database
- Production-like environment
- Automated testing

### Production
- Multi-region deployment
- Blue-green deployment
- Canary releases
- Automated rollback

## Technology Decisions

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend Framework | React | Component reusability, ecosystem, THG familiarity |
| Backend Framework | NestJS | TypeScript, modularity, scalability |
| AI/Optimization | Python + OR-Tools | Best-in-class optimization library |
| Primary Database | PostgreSQL | ACID, complex queries, reliability |
| Cache | Redis | Performance, pub/sub, session management |
| Message Bus | Kafka | Event streaming, scalability, durability |
| IoT Protocol | MQTT | Lightweight, real-time, IoT standard |
| Blockchain | Polygon Edge | Cost-effective, EVM-compatible, scalable |
| Container Orchestration | Kubernetes | Industry standard, auto-scaling, THG standard |
| Cloud Provider | Azure | THG existing infrastructure |

## Future Enhancements

1. **Machine Learning**
   - Demand forecasting
   - Anomaly detection
   - Dynamic pricing

2. **Advanced Analytics**
   - Predictive maintenance
   - Customer behavior analysis
   - Carbon footprint tracking

3. **Automation**
   - Robotic process automation (RPA)
   - Auto-routing rules
   - Smart carrier selection

4. **Mobile Applications**
   - Native iOS/Android apps
   - Driver mobile app
   - Offline capabilities
