# THG TMS - Gap Analysis & Production Roadmap
**Date:** December 1, 2025
**Version:** 1.0.0-beta → 1.0.0-production
**Status:** Prototype → Enterprise-Ready System

---

## 🎯 Executive Summary

### Current State: Prototype with Mock Data
- **Frontend:** 23 fully designed pages with premium UI/UX
- **Backend:** Basic structure with placeholder API endpoints
- **Database:** Schema designed but limited implementation
- **Data:** 100% mock/static data with no real persistence
- **Authentication:** Frontend-only, no real JWT validation

### Target State: Production-Ready Enterprise Platform
- **Full-stack Implementation:** Real database transactions
- **Microservices Architecture:** Scalable, distributed services
- **Real-time Data:** WebSocket integration, event-driven architecture
- **Mobile-Ready APIs:** RESTful + GraphQL endpoints
- **Enterprise Integration:** EDI, API webhooks, THG stack integration
- **Security:** OAuth2, RBAC, audit trails, encryption

---

## 📊 Current vs. Target State Matrix

| Component | Current State | Target State | Gap Level |
|-----------|--------------|--------------|-----------|
| **Frontend Pages** | ✅ 100% Complete | ✅ Complete | ✅ DONE |
| **UI/UX Design** | ✅ 100% Complete | ✅ Complete | ✅ DONE |
| **Database Schema** | ⚠️ 40% Designed | ✅ 100% Complete | 🔴 HIGH |
| **Backend APIs** | ⚠️ 20% Placeholder | ✅ 100% Implemented | 🔴 HIGH |
| **Authentication** | ⚠️ Frontend Only | ✅ Full OAuth2/JWT | 🔴 HIGH |
| **Data Persistence** | ❌ 0% Mock Data | ✅ 100% Real DB | 🔴 CRITICAL |
| **Validations** | ❌ 0% None | ✅ Comprehensive | 🔴 HIGH |
| **Microservices** | ❌ 0% Monolith | ✅ Distributed | 🟡 MEDIUM |
| **Real-time Features** | ❌ 0% None | ✅ WebSocket/SSE | 🟡 MEDIUM |
| **Mobile APIs** | ⚠️ 30% Basic REST | ✅ REST + GraphQL | 🟡 MEDIUM |
| **External Integration** | ❌ 0% None | ✅ EDI, Webhooks | 🟡 MEDIUM |
| **Testing** | ❌ 0% None | ✅ 80%+ Coverage | 🔴 HIGH |
| **Documentation** | ✅ 80% Complete | ✅ 100% API Docs | 🟢 LOW |
| **Deployment** | ❌ 0% Dev Only | ✅ CI/CD Pipeline | 🔴 HIGH |

**Legend:** ✅ Complete | ⚠️ Partial | ❌ Not Started | 🔴 Critical | 🟡 Medium | 🟢 Low Priority

---

## 🔍 Detailed Gap Analysis

### 1. Frontend (Pages & Components)

#### ✅ **COMPLETED - No Gaps**
All 23 pages are fully designed and functional with mock data:

**Pages:**
1. Landing - Premium black & white design ✅
2. Login/Register - Auth forms ✅
3. Dashboard - Analytics overview ✅
4. Shipments - List & management ✅
5. ShipmentDetail - Tracking with Leaflet map ✅
6. LiveTracking - Real-time GPS visualization ✅
7. Fleet - Vehicle management ✅
8. VehicleDetail - Vehicle info ✅
9. Carriers - Carrier network ✅
10. CarrierDetail - Carrier profiles ✅
11. Routes - Lane management ✅
12. Inbound - ASN receiving ✅
13. InboundDetail - Detailed ASN ✅
14. Outbound - Shipping operations ✅
15. OutboundDetail - Detailed shipping ✅
16. DockScheduling - Appointment scheduling ✅
17. GatePass - Gate management ✅
18. Loading - Load planning ✅
19. VehicleCapacity - Capacity planning ✅
20. Yard - Yard management ✅
21. Returns - Returns processing ✅
22. Tendering - Carrier tendering ✅
23. Analytics - Advanced reporting ✅

**Components:**
- ✅ 30+ reusable components
- ✅ Interactive maps (Leaflet)
- ✅ Modal dialogs
- ✅ Form components
- ✅ IoT dashboards

**Action Required:** None - Frontend is production-ready

---

### 2. Backend API Endpoints

#### ❌ **CRITICAL GAP - 80% Missing Implementation**

**Current State:**
- Placeholder controllers with empty methods
- No database queries
- No data validation
- Returns mock/hardcoded data

**Required Implementation:**

#### **2.1 Authentication & Authorization APIs**

```typescript
// Currently: Frontend only, no real validation
// Required: Full OAuth2/JWT implementation

POST   /api/auth/register           - User registration with email verification
POST   /api/auth/login              - JWT token generation with refresh tokens
POST   /api/auth/refresh            - Refresh access token
POST   /api/auth/logout             - Invalidate tokens
POST   /api/auth/forgot-password    - Password reset email
POST   /api/auth/reset-password     - Reset password with token
GET    /api/auth/me                 - Get current user profile
PUT    /api/auth/me                 - Update user profile
POST   /api/auth/change-password    - Change password
GET    /api/auth/sessions           - List active sessions
DELETE /api/auth/sessions/:id       - Revoke session

// OAuth2 providers
GET    /api/auth/google             - Google OAuth login
GET    /api/auth/microsoft          - Microsoft OAuth login
GET    /api/auth/callback/:provider - OAuth callback handler

// Multi-factor authentication
POST   /api/auth/mfa/enable         - Enable 2FA
POST   /api/auth/mfa/verify         - Verify 2FA code
POST   /api/auth/mfa/disable        - Disable 2FA
```

#### **2.2 Shipment Management APIs**

```typescript
// Currently: Mock data only
// Required: Full CRUD with complex business logic

// Core CRUD
GET    /api/shipments                    - List all shipments (pagination, filters)
POST   /api/shipments                    - Create new shipment
GET    /api/shipments/:id                - Get shipment details
PUT    /api/shipments/:id                - Update shipment
DELETE /api/shipments/:id                - Cancel/delete shipment
PATCH  /api/shipments/:id/status         - Update shipment status

// Advanced operations
POST   /api/shipments/bulk               - Bulk create shipments
PUT    /api/shipments/bulk               - Bulk update shipments
GET    /api/shipments/:id/timeline       - Get tracking timeline
POST   /api/shipments/:id/documents      - Upload shipment documents
GET    /api/shipments/:id/documents      - Get shipment documents
POST   /api/shipments/:id/notes          - Add shipment notes
GET    /api/shipments/:id/notes          - Get shipment notes
POST   /api/shipments/:id/split          - Split shipment into multiple
POST   /api/shipments/:id/merge          - Merge with another shipment
GET    /api/shipments/:id/history        - Get audit history
POST   /api/shipments/:id/exception      - Report exception/delay
GET    /api/shipments/:id/cost           - Calculate shipment cost
POST   /api/shipments/:id/insurance      - Add insurance
GET    /api/shipments/:id/pod            - Get proof of delivery
POST   /api/shipments/:id/pod            - Upload proof of delivery

// Real-time tracking
GET    /api/shipments/:id/location       - Get current GPS location
POST   /api/shipments/:id/location       - Update GPS location
WS     /api/shipments/:id/live           - WebSocket live tracking

// Analytics
GET    /api/shipments/analytics          - Shipment analytics
GET    /api/shipments/statistics         - Shipment statistics
GET    /api/shipments/export             - Export shipments (CSV/Excel)
```

#### **2.3 Fleet Management APIs**

```typescript
// Currently: Mock vehicle data
// Required: Real-time fleet management

// Vehicle CRUD
GET    /api/fleet/vehicles               - List all vehicles
POST   /api/fleet/vehicles               - Add new vehicle
GET    /api/fleet/vehicles/:id           - Get vehicle details
PUT    /api/fleet/vehicles/:id           - Update vehicle
DELETE /api/fleet/vehicles/:id           - Remove vehicle

// Vehicle tracking
GET    /api/fleet/vehicles/:id/location  - Get current location
POST   /api/fleet/vehicles/:id/location  - Update location
WS     /api/fleet/vehicles/:id/live      - Live GPS tracking
GET    /api/fleet/vehicles/:id/route     - Get planned route
POST   /api/fleet/vehicles/:id/route     - Update route

// Vehicle operations
GET    /api/fleet/vehicles/:id/status    - Get vehicle status
PATCH  /api/fleet/vehicles/:id/status    - Update status (available, in-use, maintenance)
GET    /api/fleet/vehicles/:id/maintenance - Get maintenance history
POST   /api/fleet/vehicles/:id/maintenance - Schedule maintenance
GET    /api/fleet/vehicles/:id/fuel      - Get fuel consumption
POST   /api/fleet/vehicles/:id/fuel      - Log fuel entry
GET    /api/fleet/vehicles/:id/utilization - Get utilization stats

// Driver management
GET    /api/fleet/drivers                - List all drivers
POST   /api/fleet/drivers                - Add driver
GET    /api/fleet/drivers/:id            - Get driver details
PUT    /api/fleet/drivers/:id            - Update driver
DELETE /api/fleet/drivers/:id            - Remove driver
GET    /api/fleet/drivers/:id/performance - Get driver performance
GET    /api/fleet/drivers/:id/hours      - Get hours of service
POST   /api/fleet/drivers/:id/assign     - Assign to vehicle

// IoT sensor integration
GET    /api/fleet/vehicles/:id/sensors   - Get sensor data
POST   /api/fleet/vehicles/:id/sensors   - Update sensor data
WS     /api/fleet/vehicles/:id/sensors/live - Live sensor stream
GET    /api/fleet/vehicles/:id/alerts    - Get sensor alerts
```

#### **2.4 Carrier Management APIs**

```typescript
// Currently: Static carrier list
// Required: Full carrier lifecycle management

// Carrier CRUD
GET    /api/carriers                     - List all carriers
POST   /api/carriers                     - Onboard new carrier
GET    /api/carriers/:id                 - Get carrier details
PUT    /api/carriers/:id                 - Update carrier
DELETE /api/carriers/:id                 - Remove carrier
PATCH  /api/carriers/:id/status          - Update carrier status

// Carrier operations
GET    /api/carriers/:id/performance     - Get performance metrics
GET    /api/carriers/:id/rates           - Get rate cards
POST   /api/carriers/:id/rates           - Add/update rates
GET    /api/carriers/:id/contracts       - Get contracts
POST   /api/carriers/:id/contracts       - Create contract
GET    /api/carriers/:id/shipments       - Get carrier shipments
GET    /api/carriers/:id/capacity        - Get available capacity
POST   /api/carriers/:id/capacity        - Update capacity

// Carrier tendering
POST   /api/carriers/tender              - Create tender request
GET    /api/carriers/tender/:id          - Get tender details
POST   /api/carriers/tender/:id/bid      - Submit bid
PUT    /api/carriers/tender/:id/award    - Award tender
POST   /api/carriers/tender/:id/accept   - Accept tender
POST   /api/carriers/tender/:id/reject   - Reject tender

// Carrier integration
POST   /api/carriers/:id/webhook         - Register webhook
GET    /api/carriers/:id/webhook         - Get webhook config
POST   /api/carriers/:id/edi             - Send EDI message
GET    /api/carriers/:id/api-key         - Generate API key
```

#### **2.5 Route & Lane Management APIs**

```typescript
// Currently: Mock routes
// Required: Intelligent route optimization

// Route CRUD
GET    /api/routes                       - List all routes
POST   /api/routes                       - Create route
GET    /api/routes/:id                   - Get route details
PUT    /api/routes/:id                   - Update route
DELETE /api/routes/:id                   - Delete route

// Route optimization
POST   /api/routes/optimize              - Optimize route (AI-powered)
POST   /api/routes/:id/optimize          - Optimize specific route
GET    /api/routes/:id/alternatives      - Get alternative routes
POST   /api/routes/multi-stop            - Plan multi-stop route
GET    /api/routes/:id/distance          - Calculate distance
GET    /api/routes/:id/eta               - Calculate ETA
GET    /api/routes/:id/cost              - Calculate route cost

// Lane management
GET    /api/lanes                        - List all lanes
POST   /api/lanes                        - Create lane
GET    /api/lanes/:id                    - Get lane details
PUT    /api/lanes/:id                    - Update lane
DELETE /api/lanes/:id                    - Delete lane
GET    /api/lanes/:id/carriers           - Get lane carriers
POST   /api/lanes/:id/carriers           - Add carrier to lane
GET    /api/lanes/:id/rates              - Get lane rates
POST   /api/lanes/:id/rates              - Update lane rates
GET    /api/lanes/:id/performance        - Get lane performance
```

#### **2.6 Warehouse Operations APIs**

```typescript
// Inbound operations
GET    /api/inbound/asn                  - List ASNs
POST   /api/inbound/asn                  - Create ASN
GET    /api/inbound/asn/:id              - Get ASN details
PUT    /api/inbound/asn/:id              - Update ASN
POST   /api/inbound/asn/:id/receive      - Start receiving
POST   /api/inbound/asn/:id/receive/item - Receive item
POST   /api/inbound/asn/:id/complete     - Complete receiving
POST   /api/inbound/asn/:id/putaway      - Putaway inventory
GET    /api/inbound/asn/:id/documents    - Get ASN documents
POST   /api/inbound/asn/:id/inspection   - Add quality inspection

// Outbound operations
GET    /api/outbound/orders              - List outbound orders
POST   /api/outbound/orders              - Create outbound order
GET    /api/outbound/orders/:id          - Get order details
PUT    /api/outbound/orders/:id          - Update order
POST   /api/outbound/orders/:id/pick     - Start picking
POST   /api/outbound/orders/:id/pack     - Pack order
POST   /api/outbound/orders/:id/ship     - Ship order
POST   /api/outbound/orders/:id/label    - Generate shipping label
GET    /api/outbound/orders/:id/manifest - Get shipping manifest

// Dock scheduling
GET    /api/dock/appointments            - List appointments
POST   /api/dock/appointments            - Schedule appointment
GET    /api/dock/appointments/:id        - Get appointment details
PUT    /api/dock/appointments/:id        - Update appointment
DELETE /api/dock/appointments/:id        - Cancel appointment
PATCH  /api/dock/appointments/:id/checkin - Check-in appointment
PATCH  /api/dock/appointments/:id/complete - Complete appointment
GET    /api/dock/availability            - Get dock availability

// Yard management
GET    /api/yard/locations               - List yard locations
GET    /api/yard/trailers                - List trailers in yard
POST   /api/yard/trailers                - Add trailer to yard
PUT    /api/yard/trailers/:id            - Update trailer location
DELETE /api/yard/trailers/:id            - Remove trailer from yard
GET    /api/yard/utilization             - Get yard utilization
```

#### **2.7 Analytics & Reporting APIs**

```typescript
// Real-time analytics
GET    /api/analytics/dashboard          - Main dashboard data
GET    /api/analytics/kpi                - Key performance indicators
GET    /api/analytics/shipments          - Shipment analytics
GET    /api/analytics/carriers           - Carrier performance
GET    /api/analytics/routes             - Route performance
GET    /api/analytics/fleet              - Fleet utilization
GET    /api/analytics/warehouse          - Warehouse metrics
GET    /api/analytics/financial          - Financial analytics

// Custom reports
GET    /api/reports                      - List saved reports
POST   /api/reports                      - Create custom report
GET    /api/reports/:id                  - Get report
PUT    /api/reports/:id                  - Update report
DELETE /api/reports/:id                  - Delete report
POST   /api/reports/:id/generate         - Generate report
POST   /api/reports/:id/export           - Export report (PDF/Excel)
POST   /api/reports/:id/schedule         - Schedule report

// Data export
POST   /api/export/shipments             - Export shipments
POST   /api/export/invoices              - Export invoices
POST   /api/export/analytics             - Export analytics
```

#### **2.8 Integration APIs**

```typescript
// Webhook management
GET    /api/webhooks                     - List webhooks
POST   /api/webhooks                     - Create webhook
GET    /api/webhooks/:id                 - Get webhook
PUT    /api/webhooks/:id                 - Update webhook
DELETE /api/webhooks/:id                 - Delete webhook
GET    /api/webhooks/:id/logs            - Get webhook logs
POST   /api/webhooks/:id/test            - Test webhook

// EDI integration
POST   /api/edi/send                     - Send EDI message
POST   /api/edi/receive                  - Receive EDI message
GET    /api/edi/transactions             - List EDI transactions
GET    /api/edi/transactions/:id         - Get EDI transaction

// THG Ingenuity integration
POST   /api/thg/sync                     - Sync with THG platform
GET    /api/thg/orders                   - Get THG orders
POST   /api/thg/orders/:id/fulfill       - Fulfill THG order
POST   /api/thg/inventory/sync           - Sync inventory
GET    /api/thg/customers                - Get THG customers
```

---

### 3. Database Design & Implementation

#### ⚠️ **HIGH GAP - 60% Missing**

**Current State:**
- Basic Prisma schema with core models
- No indexes or constraints
- No audit trails
- No soft deletes
- Missing many relationships

**Required Database Architecture:**

#### **3.1 Complete Prisma Schema**

```prisma
// Required additions to schema.prisma

// Enhanced User model with audit
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     Boolean   @default(false)
  emailVerifiedAt   DateTime?
  password          String
  firstName         String
  lastName          String
  phone             String?
  avatar            String?
  role              UserRole
  status            UserStatus @default(ACTIVE)
  company           Company?   @relation(fields: [companyId], references: [id])
  companyId         String?
  permissions       Permission[]
  sessions          Session[]
  refreshTokens     RefreshToken[]
  mfaEnabled        Boolean   @default(false)
  mfaSecret         String?
  lastLoginAt       DateTime?
  lastLoginIp       String?
  failedLoginAttempts Int     @default(0)
  lockedUntil       DateTime?
  passwordChangedAt DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?  // Soft delete

  // Relationships
  createdShipments  Shipment[] @relation("CreatedBy")
  assignedShipments Shipment[] @relation("AssignedTo")
  auditLogs         AuditLog[]
  notifications     Notification[]

  @@index([email])
  @@index([companyId])
  @@index([role])
  @@index([status])
  @@map("users")
}

// Session management
model Session {
  id           String   @id @default(cuid())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String
  token        String   @unique
  expiresAt    DateTime
  ipAddress    String
  userAgent    String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}

// Refresh tokens
model RefreshToken {
  id           String   @id @default(cuid())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String
  token        String   @unique
  expiresAt    DateTime
  isRevoked    Boolean  @default(false)
  replacedBy   String?
  createdAt    DateTime @default(now())

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}

// Enhanced Shipment model
model Shipment {
  id                String         @id @default(cuid())
  shipmentNumber    String         @unique
  referenceNumber   String?
  externalId        String?
  status            ShipmentStatus @default(PENDING)
  priority          Priority       @default(STANDARD)
  serviceLevel      ServiceLevel
  mode              TransportMode

  // Origin & Destination
  origin            Address        @relation("ShipmentOrigin", fields: [originId], references: [id])
  originId          String
  destination       Address        @relation("ShipmentDestination", fields: [destinationId], references: [id])
  destinationId     String

  // Parties
  shipper           Contact        @relation("Shipper", fields: [shipperId], references: [id])
  shipperId         String
  consignee         Contact        @relation("Consignee", fields: [consigneeId], references: [id])
  consigneeId       String
  billTo            Contact?       @relation("BillTo", fields: [billToId], references: [id])
  billToId          String?

  // Carrier & Route
  carrier           Carrier?       @relation(fields: [carrierId], references: [id])
  carrierId         String?
  route             Route?         @relation(fields: [routeId], references: [id])
  routeId           String?
  vehicle           Vehicle?       @relation(fields: [vehicleId], references: [id])
  vehicleId         String?
  driver            Driver?        @relation(fields: [driverId], references: [id])
  driverId          String?

  // Cargo details
  items             ShipmentItem[]
  totalWeight       Decimal
  totalVolume       Decimal?
  totalValue        Decimal
  currency          String         @default("USD")
  packageCount      Int
  palletCount       Int?

  // Dates & Times
  pickupDate        DateTime?
  pickupTimeStart   DateTime?
  pickupTimeEnd     DateTime?
  deliveryDate      DateTime?
  deliveryTimeStart DateTime?
  deliveryTimeEnd   DateTime?
  estimatedArrival  DateTime?
  actualPickup      DateTime?
  actualDelivery    DateTime?

  // Tracking
  currentLocation   Json?
  trackingEvents    TrackingEvent[]
  iotDeviceId       String?
  sensorData        SensorReading[]

  // Documents
  documents         Document[]
  proofOfDelivery   Document?      @relation("POD", fields: [podId], references: [id])
  podId             String?
  billOfLading      String?

  // Financial
  charges           Charge[]
  totalCost         Decimal?
  totalRevenue      Decimal?
  margin            Decimal?
  invoiced          Boolean        @default(false)
  paid              Boolean        @default(false)

  // Insurance & Risk
  insuranceRequired Boolean        @default(false)
  insuranceAmount   Decimal?
  insuranceProvider String?
  declaredValue     Decimal?

  // Special handling
  requiresSignature Boolean        @default(false)
  requiresAppointment Boolean      @default(false)
  temperatureControlled Boolean    @default(false)
  hazmat            Boolean        @default(false)
  fragile           Boolean        @default(false)
  specialInstructions String?

  // Exceptions & Issues
  exceptions        Exception[]
  delays            Delay[]
  claims            Claim[]

  // Metadata
  tags              String[]
  customFields      Json?
  notes             Note[]
  createdBy         User           @relation("CreatedBy", fields: [createdById], references: [id])
  createdById       String
  assignedTo        User?          @relation("AssignedTo", fields: [assignedToId], references: [id])
  assignedToId      String?
  company           Company        @relation(fields: [companyId], references: [id])
  companyId         String
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  deletedAt         DateTime?

  @@index([shipmentNumber])
  @@index([status])
  @@index([carrierId])
  @@index([pickupDate])
  @@index([deliveryDate])
  @@index([companyId])
  @@index([createdById])
  @@map("shipments")
}

// Shipment items
model ShipmentItem {
  id           String   @id @default(cuid())
  shipment     Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  shipmentId   String
  sku          String?
  description  String
  quantity     Int
  weight       Decimal
  volume       Decimal?
  value        Decimal?
  dimensions   Json?    // {length, width, height, unit}
  packaging    String?
  serialNumbers String[]
  lotNumbers   String[]
  expiryDate   DateTime?

  @@index([shipmentId])
  @@map("shipment_items")
}

// Tracking events
model TrackingEvent {
  id           String      @id @default(cuid())
  shipment     Shipment    @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  shipmentId   String
  eventType    EventType
  status       String
  description  String
  location     String?
  coordinates  Json?       // {lat, lng}
  timestamp    DateTime    @default(now())
  source       String      // GPS, MANUAL, CARRIER_API, EDI
  metadata     Json?

  @@index([shipmentId])
  @@index([timestamp])
  @@map("tracking_events")
}

// IoT sensor readings
model SensorReading {
  id           String      @id @default(cuid())
  shipment     Shipment    @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  shipmentId   String
  deviceId     String
  sensorType   SensorType
  value        Decimal
  unit         String
  threshold    Decimal?
  status       AlertStatus @default(NORMAL)
  coordinates  Json?
  timestamp    DateTime    @default(now())

  @@index([shipmentId])
  @@index([deviceId])
  @@index([timestamp])
  @@map("sensor_readings")
}

// Enhanced Carrier model
model Carrier {
  id               String      @id @default(cuid())
  code             String      @unique
  name             String
  legalName        String?
  scac             String?     @unique
  dot              String?
  mc               String?
  taxId            String?
  type             CarrierType
  modes            TransportMode[]

  // Contact
  email            String
  phone            String
  website          String?
  address          Address?    @relation(fields: [addressId], references: [id])
  addressId        String?

  // Operations
  serviceAreas     ServiceArea[]
  lanes            Lane[]
  contracts        Contract[]
  rates            Rate[]
  capacity         Capacity[]

  // Performance
  rating           Decimal?
  onTimeRate       Decimal?
  claimRate        Decimal?
  totalShipments   Int         @default(0)
  totalRevenue     Decimal?

  // Insurance & Compliance
  insuranceAmount  Decimal?
  insuranceExpiry  DateTime?
  licenseExpiry    DateTime?
  certifications   String[]

  // Integration
  apiKey           String?
  apiSecret        String?
  ediEnabled       Boolean     @default(false)
  ediQualifier     String?
  ediId            String?
  webhookUrl       String?

  // Status
  status           CarrierStatus @default(ACTIVE)
  approvedAt       DateTime?
  approvedBy       String?

  // Relationships
  shipments        Shipment[]
  invoices         Invoice[]
  company          Company     @relation(fields: [companyId], references: [id])
  companyId        String
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  deletedAt        DateTime?

  @@index([code])
  @@index([scac])
  @@index([status])
  @@index([companyId])
  @@map("carriers")
}

// Address model
model Address {
  id           String      @id @default(cuid())
  line1        String
  line2        String?
  city         String
  state        String
  postalCode   String
  country      String      @default("US")
  coordinates  Json?       // {lat, lng}
  type         AddressType

  // Relationships
  carriersAtAddress Carrier[]
  shipmentsOrigin   Shipment[] @relation("ShipmentOrigin")
  shipmentsDestination Shipment[] @relation("ShipmentDestination")

  @@index([city])
  @@index([state])
  @@index([postalCode])
  @@map("addresses")
}

// Audit log
model AuditLog {
  id           String   @id @default(cuid())
  user         User?    @relation(fields: [userId], references: [id])
  userId       String?
  action       String
  entity       String
  entityId     String
  changes      Json?
  ipAddress    String?
  userAgent    String?
  timestamp    DateTime @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@index([timestamp])
  @@map("audit_logs")
}

// Enums
enum UserRole {
  SUPER_ADMIN
  ADMIN
  MANAGER
  OPERATOR
  VIEWER
  DRIVER
  CARRIER_ADMIN
  CARRIER_USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING
}

enum ShipmentStatus {
  PENDING
  CONFIRMED
  ASSIGNED
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  EXCEPTION
  CANCELLED
  RETURNED
}

enum TransportMode {
  LTL
  FTL
  PARCEL
  AIR
  OCEAN
  RAIL
  INTERMODAL
}

enum Priority {
  STANDARD
  EXPRESS
  OVERNIGHT
  SAME_DAY
}

enum ServiceLevel {
  GROUND
  EXPRESS
  OVERNIGHT
  TWO_DAY
  THREE_DAY
  ECONOMY
}

enum EventType {
  CREATED
  UPDATED
  ASSIGNED
  PICKED_UP
  IN_TRANSIT
  ARRIVED
  DEPARTED
  DELIVERED
  EXCEPTION
  DELAYED
  CANCELLED
}

enum SensorType {
  GPS
  TEMPERATURE
  HUMIDITY
  SHOCK
  TILT
  LIGHT
  DOOR
  BATTERY
  FUEL
  TIRE_PRESSURE
}

enum AlertStatus {
  NORMAL
  WARNING
  CRITICAL
}

enum CarrierType {
  ASSET
  BROKER
  THREE_PL
  COURIER
  FREIGHT_FORWARDER
}

enum CarrierStatus {
  PENDING
  ACTIVE
  SUSPENDED
  INACTIVE
}

enum AddressType {
  WAREHOUSE
  CUSTOMER
  CARRIER
  TERMINAL
}
```

**Required Database Features:**

1. **Indexes:**
   - Primary keys on all tables
   - Foreign key indexes
   - Composite indexes for common queries
   - Full-text search indexes

2. **Constraints:**
   - Foreign key constraints with CASCADE/RESTRICT
   - Unique constraints
   - Check constraints for data validation
   - Default values

3. **Triggers:**
   - Auto-update timestamps
   - Audit trail triggers
   - Data validation triggers
   - Cascade update triggers

4. **Views:**
   - Shipment summary view
   - Carrier performance view
   - Fleet utilization view
   - Financial dashboard view

5. **Stored Procedures:**
   - Complex cost calculations
   - Route optimization queries
   - Performance analytics
   - Data archival

6. **Data Migration:**
   - Versioned migrations
   - Rollback scripts
   - Seed data scripts
   - Data validation scripts

---

### 4. Data Validation & Business Logic

#### ❌ **CRITICAL GAP - 100% Missing**

**Required Implementations:**

#### **4.1 Input Validation (class-validator)**

```typescript
// Example: CreateShipmentDto
import { IsString, IsEnum, IsDate, IsNumber, ValidateNested, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;

  @IsEnum(TransportMode)
  mode: TransportMode;

  @IsEnum(ServiceLevel)
  serviceLevel: ServiceLevel;

  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  items: ShipmentItemDto[];

  @IsNumber()
  @Min(0)
  totalWeight: number;

  @IsNumber()
  @Min(0)
  totalValue: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  pickupDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deliveryDate?: Date;
}
```

#### **4.2 Business Rules Engine**

```typescript
// Example: Shipment validation rules
class ShipmentBusinessRules {
  validatePickupDate(shipment: Shipment): ValidationResult {
    // Cannot pick up in the past
    if (shipment.pickupDate < new Date()) {
      return { valid: false, error: 'Pickup date cannot be in the past' };
    }

    // Must be at least 2 hours in future
    const twoHoursFromNow = addHours(new Date(), 2);
    if (shipment.pickupDate < twoHoursFromNow) {
      return { valid: false, error: 'Pickup must be scheduled at least 2 hours in advance' };
    }

    return { valid: true };
  }

  validateDeliveryDate(shipment: Shipment): ValidationResult {
    // Delivery must be after pickup
    if (shipment.deliveryDate <= shipment.pickupDate) {
      return { valid: false, error: 'Delivery date must be after pickup date' };
    }

    // Check carrier transit times
    const transitTime = this.calculateTransitTime(shipment);
    const minDeliveryDate = addDays(shipment.pickupDate, transitTime);
    if (shipment.deliveryDate < minDeliveryDate) {
      return { valid: false, error: `Minimum transit time is ${transitTime} days` };
    }

    return { valid: true };
  }

  validateCarrierCapacity(shipment: Shipment, carrier: Carrier): ValidationResult {
    // Check if carrier has capacity for this lane
    const capacity = this.getCarrierCapacity(carrier, shipment.route);
    if (capacity.available < shipment.totalWeight) {
      return { valid: false, error: 'Carrier does not have sufficient capacity' };
    }

    return { valid: true };
  }

  validateHazmatCompliance(shipment: Shipment): ValidationResult {
    if (shipment.hazmat) {
      // Verify carrier is certified for hazmat
      if (!shipment.carrier.certifications.includes('HAZMAT')) {
        return { valid: false, error: 'Carrier not certified for hazmat shipments' };
      }

      // Verify proper documentation
      if (!shipment.documents.some(d => d.type === 'HAZMAT_DECLARATION')) {
        return { valid: false, error: 'Hazmat declaration required' };
      }
    }

    return { valid: true };
  }
}
```

#### **4.3 Complex Business Logic**

Required implementations:
- ✅ Rate calculation engine
- ✅ Route optimization algorithm
- ✅ Carrier selection logic
- ✅ Capacity planning
- ✅ Cost allocation
- ✅ Invoice generation
- ✅ SLA monitoring
- ✅ Exception handling workflows
- ✅ Automated notifications

---

### 5. Microservices Architecture

#### ❌ **MEDIUM GAP - 100% Missing**

**Current State:** Monolithic NestJS application

**Target State:** Distributed microservices

**Required Microservices:**

```
1. Auth Service (Port 3001)
   - User authentication
   - Authorization & RBAC
   - Session management
   - OAuth integration

2. Shipment Service (Port 3002)
   - Shipment CRUD
   - Status management
   - Document management
   - Exception handling

3. Tracking Service (Port 3003)
   - Real-time GPS tracking
   - Event processing
   - IoT integration
   - Location updates

4. Carrier Service (Port 3004)
   - Carrier management
   - Rate management
   - Tendering process
   - Performance tracking

5. Fleet Service (Port 3005)
   - Vehicle management
   - Driver management
   - Maintenance tracking
   - Fuel management

6. Warehouse Service (Port 3006)
   - Inbound operations
   - Outbound operations
   - Inventory management
   - Dock scheduling

7. Route Service (Port 3007)
   - Route planning
   - Optimization engine
   - Lane management
   - Distance calculations

8. Billing Service (Port 3008)
   - Cost calculation
   - Invoice generation
   - Payment processing
   - Financial reporting

9. Analytics Service (Port 3009)
   - Real-time analytics
   - Report generation
   - KPI calculations
   - Data aggregation

10. Notification Service (Port 3010)
    - Email notifications
    - SMS alerts
    - Push notifications
    - Webhook triggers

11. Integration Service (Port 3011)
    - EDI processing
    - API integrations
    - Webhook management
    - THG sync

12. Document Service (Port 3012)
    - Document storage (S3)
    - PDF generation
    - E-signature
    - OCR processing
```

**Inter-service Communication:**
- HTTP/REST for synchronous calls
- RabbitMQ/Kafka for async messaging
- gRPC for high-performance needs
- Redis for caching & pub/sub

**Service Discovery:**
- Consul or Eureka
- API Gateway (Kong/AWS API Gateway)
- Load balancing
- Health checks

---

### 6. Real-time Features

#### ❌ **HIGH GAP - 100% Missing**

**Required Implementations:**

1. **WebSocket Server:**
   ```typescript
   // Real-time shipment tracking
   WS /ws/shipments/:id/track
   WS /ws/fleet/vehicles/:id/location
   WS /ws/notifications
   WS /ws/dashboard/live
   ```

2. **Server-Sent Events (SSE):**
   ```typescript
   // One-way updates
   GET /api/events/shipments/:id
   GET /api/events/dashboard
   ```

3. **Event-Driven Architecture:**
   - Event bus (RabbitMQ/Kafka)
   - Event sourcing for audit trails
   - CQRS pattern for read/write separation

4. **Push Notifications:**
   - Firebase Cloud Messaging
   - Apple Push Notification Service
   - Web Push API

---

### 7. Mobile API Requirements

#### ⚠️ **MEDIUM GAP - 70% Missing**

**Required for Mobile Apps:**

1. **GraphQL API:**
   ```graphql
   # Efficient data fetching for mobile
   type Query {
     shipment(id: ID!): Shipment
     shipments(
       page: Int
       limit: Int
       status: ShipmentStatus
       searchTerm: String
     ): ShipmentConnection

     driver: Driver
     assignedShipments: [Shipment!]!
     todaysRoute: Route
   }

   type Mutation {
     updateShipmentLocation(
       id: ID!
       latitude: Float!
       longitude: Float!
     ): Shipment

     uploadProofOfDelivery(
       shipmentId: ID!
       photo: Upload!
       signature: Upload!
       notes: String
     ): Document

     updateShipmentStatus(
       id: ID!
       status: ShipmentStatus!
       notes: String
     ): Shipment
   }

   type Subscription {
     shipmentUpdated(id: ID!): Shipment
     newShipmentAssigned: Shipment
   }
   ```

2. **Mobile-Optimized Endpoints:**
   - Batch requests
   - Compressed responses (gzip)
   - Pagination with cursor-based navigation
   - Image optimization
   - Offline sync support

3. **Mobile SDKs:**
   - iOS SDK (Swift)
   - Android SDK (Kotlin)
   - React Native SDK
   - Flutter SDK

---

### 8. External Integrations

#### ❌ **HIGH GAP - 100% Missing**

**Required Integrations:**

#### **8.1 EDI (Electronic Data Interchange)**

```typescript
// Supported EDI transaction sets
- 204 Motor Carrier Load Tender
- 210 Motor Carrier Freight Details
- 211 Motor Carrier Bill of Lading
- 214 Transportation Carrier Shipment Status
- 990 Response to a Load Tender
- 997 Functional Acknowledgment

// Implementation
class EDIService {
  async sendLoadTender(shipment: Shipment): Promise<void> {
    const edi204 = this.generate204(shipment);
    await this.sendToCarrier(shipment.carrier, edi204);
  }

  async processStatusUpdate(edi214: string): Promise<void> {
    const update = this.parse214(edi214);
    await this.updateShipmentStatus(update);
  }
}
```

#### **8.2 Carrier API Integrations**

```typescript
// Major carriers to integrate
- FedEx Web Services API
- UPS API
- DHL Express API
- USPS Web Tools
- Maersk API
- C.H. Robinson API
- XPO Logistics API
- J.B. Hunt API

// Implementation pattern
interface CarrierAdapter {
  createShipment(shipment: Shipment): Promise<CarrierResponse>;
  getRate(origin: Address, destination: Address, details: ShipmentDetails): Promise<Rate>;
  trackShipment(trackingNumber: string): Promise<TrackingInfo>;
  schedulePickup(pickup: Pickup): Promise<PickupConfirmation>;
  cancelShipment(trackingNumber: string): Promise<void>;
}
```

#### **8.3 THG Ingenuity Integration**

```typescript
// Integration with THG platform
class THGIntegrationService {
  // Sync orders from THG e-commerce platform
  async syncOrders(): Promise<void> {
    const orders = await this.thgClient.getOrders();
    for (const order of orders) {
      await this.createShipmentFromOrder(order);
    }
  }

  // Update THG with fulfillment status
  async updateFulfillmentStatus(orderId: string, status: string): Promise<void> {
    await this.thgClient.updateOrderStatus(orderId, status);
  }

  // Sync inventory levels
  async syncInventory(): Promise<void> {
    const inventory = await this.getInventoryLevels();
    await this.thgClient.updateInventory(inventory);
  }

  // Get THG customer data
  async getCustomer(customerId: string): Promise<Customer> {
    return await this.thgClient.getCustomer(customerId);
  }
}
```

#### **8.4 Payment Gateway Integration**

```typescript
// Payment processing
- Stripe
- PayPal
- Authorize.Net
- Square

// Implementation
class PaymentService {
  async processPayment(invoice: Invoice): Promise<Payment> {
    return await this.stripeClient.charge({
      amount: invoice.totalAmount,
      currency: invoice.currency,
      customer: invoice.customerId,
      description: `Invoice ${invoice.number}`,
    });
  }

  async refund(paymentId: string, amount: number): Promise<Refund> {
    return await this.stripeClient.refund({
      charge: paymentId,
      amount: amount,
    });
  }
}
```

#### **8.5 Mapping & Geocoding**

```typescript
// Mapping services
- Google Maps API
- Mapbox API
- HERE Maps API

// Implementation
class GeocodingService {
  async geocodeAddress(address: Address): Promise<Coordinates> {
    const response = await this.googleMapsClient.geocode({
      address: this.formatAddress(address),
    });
    return {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng,
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<Address> {
    const response = await this.googleMapsClient.reverseGeocode({
      latlng: `${lat},${lng}`,
    });
    return this.parseGoogleAddress(response.results[0]);
  }

  async calculateRoute(origin: Coordinates, destination: Coordinates): Promise<Route> {
    const response = await this.googleMapsClient.directions({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: 'driving',
    });
    return this.parseRoute(response.routes[0]);
  }
}
```

---

### 9. Testing

#### ❌ **CRITICAL GAP - 100% Missing**

**Required Testing Strategy:**

1. **Unit Tests (Jest):**
   - All service methods
   - Business logic
   - Utility functions
   - Target: 80%+ code coverage

2. **Integration Tests:**
   - API endpoint tests
   - Database operations
   - External service mocks
   - Target: 70%+ coverage

3. **E2E Tests (Cypress/Playwright):**
   - User workflows
   - Critical paths
   - Mobile app flows

4. **Performance Tests (K6):**
   - Load testing
   - Stress testing
   - Endurance testing
   - Spike testing

5. **Security Tests:**
   - Penetration testing
   - Vulnerability scanning
   - OWASP compliance
   - SQL injection prevention

---

### 10. Security Enhancements

#### ⚠️ **HIGH GAP - 60% Missing**

**Required Security Features:**

1. **Authentication:**
   - ✅ OAuth2 / OpenID Connect
   - ✅ Multi-factor authentication (TOTP)
   - ✅ Biometric authentication (mobile)
   - ✅ Single Sign-On (SSO)
   - ✅ SAML integration

2. **Authorization:**
   - ✅ Role-Based Access Control (RBAC)
   - ✅ Attribute-Based Access Control (ABAC)
   - ✅ Row-level security
   - ✅ Field-level permissions
   - ✅ API key management

3. **Data Security:**
   - ✅ Encryption at rest (AES-256)
   - ✅ Encryption in transit (TLS 1.3)
   - ✅ Field-level encryption for PII
   - ✅ Secure key management (AWS KMS/Vault)
   - ✅ Data masking

4. **API Security:**
   - ✅ Rate limiting
   - ✅ API versioning
   - ✅ CORS configuration
   - ✅ Request signing
   - ✅ IP whitelisting
   - ✅ DDoS protection

5. **Audit & Compliance:**
   - ✅ Comprehensive audit trails
   - ✅ SOC 2 compliance
   - ✅ GDPR compliance
   - ✅ HIPAA compliance (if healthcare)
   - ✅ PCI DSS (for payments)

---

### 11. DevOps & Deployment

#### ❌ **CRITICAL GAP - 100% Missing**

**Required Infrastructure:**

1. **Containerization:**
   ```dockerfile
   # Docker images for each service
   - Frontend: nginx + React bundle
   - Backend services: Node.js Alpine
   - Database: PostgreSQL
   - Redis: Cache layer
   - RabbitMQ: Message queue
   ```

2. **Orchestration:**
   ```yaml
   # Kubernetes deployment
   - Multi-container pods
   - Auto-scaling (HPA)
   - Load balancing
   - Service mesh (Istio)
   - Secret management
   ```

3. **CI/CD Pipeline:**
   ```yaml
   # GitHub Actions / GitLab CI
   - Automated testing
   - Code quality checks (SonarQube)
   - Security scanning
   - Docker image build
   - Deployment to environments
   - Automated rollback
   ```

4. **Monitoring & Logging:**
   ```
   - Application monitoring: New Relic / Datadog
   - Log aggregation: ELK Stack
   - Error tracking: Sentry
   - Uptime monitoring: Pingdom
   - APM: New Relic
   ```

5. **Cloud Infrastructure:**
   ```
   - AWS / Azure / GCP
   - Load balancers (ALB/ELB)
   - CDN (CloudFront)
   - Object storage (S3)
   - Database (RDS/Aurora)
   - Cache (ElastiCache)
   - Message queue (SQS/SNS)
   ```

---

## 📋 Implementation Priority Matrix

### Phase 1: Foundation (Months 1-3)
**Goal:** Core functionality with real database

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Complete database schema | 🔴 CRITICAL | 2 weeks | None |
| Implement authentication API | 🔴 CRITICAL | 2 weeks | Database |
| Build shipment CRUD APIs | 🔴 CRITICAL | 3 weeks | Auth, Database |
| Implement carrier APIs | 🔴 CRITICAL | 2 weeks | Database |
| Add data validation | 🔴 CRITICAL | 2 weeks | All APIs |
| Unit testing | 🔴 CRITICAL | 3 weeks | APIs |
| Integration testing | 🔴 CRITICAL | 2 weeks | APIs |

**Deliverable:** Working TMS with real data persistence

### Phase 2: Advanced Features (Months 4-6)
**Goal:** Real-time tracking and integrations

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| WebSocket implementation | 🟡 HIGH | 2 weeks | APIs |
| IoT sensor integration | 🟡 HIGH | 3 weeks | WebSocket |
| Route optimization engine | 🟡 HIGH | 3 weeks | APIs |
| Carrier API integrations | 🟡 HIGH | 4 weeks | Carrier APIs |
| EDI implementation | 🟡 HIGH | 3 weeks | Integrations |
| GraphQL API | 🟡 MEDIUM | 2 weeks | REST APIs |
| Mobile SDK | 🟡 MEDIUM | 3 weeks | GraphQL |

**Deliverable:** Real-time tracking with carrier integrations

### Phase 3: Microservices (Months 7-9)
**Goal:** Scalable, distributed architecture

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Service decomposition | 🟡 MEDIUM | 2 weeks | Phase 2 |
| Message queue setup | 🟡 MEDIUM | 1 week | None |
| Service communication | 🟡 MEDIUM | 3 weeks | Services |
| API Gateway | 🟡 MEDIUM | 2 weeks | Services |
| Service discovery | 🟡 MEDIUM | 1 week | Services |
| Distributed tracing | 🟢 LOW | 1 week | Services |

**Deliverable:** Microservices architecture

### Phase 4: Enterprise Features (Months 10-12)
**Goal:** Production-ready enterprise platform

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| THG integration | 🟡 HIGH | 3 weeks | APIs |
| Payment gateway | 🟡 MEDIUM | 2 weeks | Billing API |
| Advanced analytics | 🟡 MEDIUM | 3 weeks | Data warehouse |
| Reporting engine | 🟡 MEDIUM | 2 weeks | Analytics |
| Multi-tenancy | 🟢 LOW | 2 weeks | Database |
| White-label | 🟢 LOW | 2 weeks | Frontend |

**Deliverable:** Enterprise-ready TMS platform

### Phase 5: Production Deployment (Month 13+)
**Goal:** Live production system

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Docker containerization | 🔴 CRITICAL | 1 week | All services |
| Kubernetes setup | 🔴 CRITICAL | 2 weeks | Docker |
| CI/CD pipeline | 🔴 CRITICAL | 2 weeks | K8s |
| Monitoring setup | 🔴 CRITICAL | 1 week | Deployment |
| Security audit | 🔴 CRITICAL | 2 weeks | All |
| Performance optimization | 🟡 HIGH | 2 weeks | All |
| Production deployment | 🔴 CRITICAL | 1 week | All |

**Deliverable:** Live production system

---

## 🎯 Success Metrics

### Technical Metrics
- **API Response Time:** < 200ms (p95)
- **Database Query Time:** < 50ms (p95)
- **Uptime:** 99.9%
- **Error Rate:** < 0.1%
- **Test Coverage:** > 80%
- **Code Quality:** A grade (SonarQube)

### Business Metrics
- **Shipment Processing:** 10,000+ shipments/day
- **Concurrent Users:** 1,000+ simultaneous
- **Data Accuracy:** 99.9%
- **Integration Success Rate:** > 95%
- **Mobile App Rating:** > 4.5 stars

---

## 📝 Next Steps

1. **Review & Prioritize:** Stakeholder review of gap analysis
2. **Resource Allocation:** Assign development teams
3. **Sprint Planning:** Break down into 2-week sprints
4. **Architecture Review:** Finalize microservices design
5. **Database Design:** Complete schema and migrations
6. **API Development:** Start with Phase 1 critical APIs
7. **Testing Strategy:** Set up testing infrastructure
8. **DevOps Setup:** Prepare deployment pipeline

---

**Document Status:** Draft for Review
**Last Updated:** December 1, 2025
**Next Review:** Start of Phase 1 Development
