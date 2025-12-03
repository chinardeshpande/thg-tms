# Claude Context - THG Transport Management System

> **Last Updated:** 2025-12-03
> **Project Status:** Active Development - Authentication Phase Complete
> **Primary Developer:** Chinar Deshpande (chinardeshpande)

## Project Overview

**THG TMS** is an enterprise-grade Transport Management System designed for logistics operations. It manages shipments, routes, carriers, vehicles, drivers, billing, and provides real-time tracking with analytics.

**Tech Stack:**
- **Backend:** NestJS (TypeScript), Prisma ORM, PostgreSQL
- **Frontend:** React, TypeScript, Vite
- **Infrastructure:** Docker, Redis (caching), GitHub Actions (planned)
- **Development:** VS Code with Claude Code + ChatGPT Codex collaboration

**Repository:** https://github.com/chinardeshpande/thg-tms

## Project Architecture

### Backend Structure (`/backend`)
```
src/
├── api/                    # Feature modules (NestJS)
│   ├── auth/              # Authentication & authorization
│   │   ├── controllers/   # Auth & Session controllers
│   │   ├── services/      # Auth, Session, Email, Audit services
│   │   ├── strategies/    # JWT, Refresh, Local Passport strategies
│   │   └── guards/        # JwtAuth, Roles, Permissions guards
│   ├── users/             # User management
│   ├── companies/         # Company/tenant management
│   ├── shipments/         # Shipment operations (disabled)
│   ├── carriers/          # Carrier management (disabled)
│   ├── routes/            # Route planning (disabled)
│   ├── tracking/          # Real-time tracking (disabled)
│   ├── billing/           # Invoice & billing (disabled)
│   └── analytics/         # Reporting & analytics (disabled)
├── services/              # Global services
│   └── prisma.service.ts  # Database connection
└── main.ts                # App bootstrap
```

### Frontend Structure (`/frontend`)
```
src/
├── components/            # React components
├── pages/                # Page components
├── services/             # API clients
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── types/                # TypeScript types
```

### Database (Prisma Schema)
- **Multi-tenant:** All data scoped by `companyId`
- **Soft deletes:** `deletedAt` field on key models
- **Audit logging:** Complete action history
- **Session management:** Secure token-based auth
- **RBAC:** Role-based + permission-based access control

## Current Implementation Status

### ✅ Completed Features

**Authentication System (100% Complete):**
- User registration with email verification
- Login with JWT access + refresh tokens
- Password reset flow with email tokens
- Session management (view/revoke sessions)
- Rate limiting (100 requests/minute)
- Audit logging (all auth actions tracked)
- Email service integration (verification, password reset)
- Multi-factor authentication structure (ready for extension)

**Database Models:**
- User, Company, Permission, Role, RolePermission
- Session, RefreshToken, VerificationToken, PasswordResetToken
- AuditLog
- Driver, Vehicle, Carrier, CarrierService, CarrierRate
- Route, RouteStop, Shipment, ShipmentTracking
- Invoice, InvoiceItem, Payment

### ⏸️ Partially Implemented (Schema Mismatches - Disabled)

**Modules with TypeScript errors (~55 total):**
- **ShipmentsModule** (~8 errors) - Field mismatches with schema
- **CarriersModule** (~1 error) - Missing company field
- **RoutesModule** (minimal errors) - Package references removed
- **TrackingModule** (~4 errors) - FacilityType enum, Package model
- **BillingModule** (~1 error) - Field mismatches
- **AnalyticsModule** (~35 errors) - Major schema misalignment

**Why Disabled:**
TypeScript compilation was failing due to services using field names that don't exist in the current Prisma schema. These modules are commented out in `app.module.ts` to allow the backend to compile and run. The authentication system (Auth, Users, Companies) is fully operational.

### 🔴 Not Started

- Frontend authentication UI integration
- Real-time notifications
- Advanced analytics dashboards
- Mobile app
- Third-party integrations (carrier APIs)
- Payment gateway integration

## Known Technical Debt & Issues

### Critical Issues (Blocking Modules)

1. **Package Model Doesn't Exist**
   - Code references `prisma.package` but model not in schema
   - Affects: routes.service.ts, tracking.service.ts
   - Solution needed: Either add Package model or remove references

2. **FacilityType Enum Missing** ✅ FIXED
   - Was causing runtime crash in tracking.dto.ts
   - Fixed by converting to string type

3. **Location Field Mismatch** ✅ FIXED
   - Schema has single `location` string + `coordinates` JSON
   - Old code used individual fields (locationStreet, locationCity, etc.)
   - Fixed in tracking.service.ts

4. **EventType Invalid Values**
   - Code used 'STATUS_CHANGE' but schema only has: CREATED, UPDATED, ASSIGNED, PICKED_UP, IN_TRANSIT, ARRIVED, DEPARTED, DELIVERED, EXCEPTION, DELAYED
   - Fixed to use 'UPDATED'

5. **~55 TypeScript Errors in Disabled Modules**
   - Analytics: ~35 errors (date fields, aggregation mismatches)
   - Shipments: ~8 errors (referenceNumber, street fields)
   - Others: Minor field mismatches
   - See AI_HANDOFF.md for details

### Design Decisions & Constraints

**Authentication Design:**
- JWT access tokens (24h expiration, configurable)
- Refresh tokens (30 days, stored in DB, rotatable)
- Email verification required for new accounts
- Password reset tokens expire in 1 hour
- Sessions tied to devices (can revoke individually)
- Rate limiting at global level (throttler guard)
- All auth actions logged to audit_logs table

**Multi-tenancy:**
- Company-scoped data isolation
- Users belong to one company
- Super admin role can access cross-company (future)
- Each company has its own drivers, vehicles, shipments

**Security:**
- Passwords hashed with bcrypt
- Tokens signed with JWT_SECRET
- Email verification prevents fake accounts
- Session hijacking protection (device fingerprinting ready)
- IP address + user agent logged in audit trail

**Database Conventions:**
- UUID primary keys (except a few legacy int IDs)
- Snake_case table names (@@map directive)
- Timestamps: createdAt, updatedAt on all models
- Soft deletes: deletedAt field where applicable
- Indexes on foreign keys and frequently queried fields

## Development Workflow

### Starting the Backend
```bash
cd /Users/chinar.deshpande06/CD-THG/2025/THG-AI/MyCodingJourney/current-projects/thg-tms/backend

# Option 1: Watch mode (if no TS errors)
npm run dev

# Option 2: Direct node execution (bypasses TS errors)
node dist/main.js
```

**Current Status:** Running on `http://localhost:3000/api` via `node dist/main.js` (process 22dfe5)

### Environment Variables (`.env`)
```
DATABASE_URL="postgresql://chinar.deshpande06@localhost:5432/thg_tms"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="30d"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

### Database Migrations
```bash
cd backend

# Create migration after schema changes
DATABASE_URL="postgresql://chinar.deshpande06@localhost:5432/thg_tms" npx prisma migrate dev --name migration_name

# Push schema without migration (dev only)
DATABASE_URL="postgresql://chinar.deshpande06@localhost:5432/thg_tms" npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Git Workflow
- **Main branch:** `main` - stable, tested code
- **Feature branches:** `feat/feature-name`
- **Bugfix branches:** `fix/issue-name`
- **Commit format:** Conventional Commits (feat:, fix:, docs:, etc.)
- **Always include:** Claude Code attribution in commits

### AI Collaboration
- **Read `AI_HANDOFF.md` first** - Check current status and who's working on what
- **Update `AI_HANDOFF.md` after work** - Document changes for next AI
- **Use feature branches** - Avoid conflicts when both AIs work in parallel
- **Small, frequent commits** - Push often so both AIs see latest code
- **This file (`claude.md`)** - Project context, doesn't change frequently

## API Endpoints (Currently Available)

### Authentication (`/api/auth`)
- `POST /register` - Register new user (sends verification email)
- `POST /login` - Login user (returns access + refresh tokens)
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout (invalidate refresh token)
- `POST /verify-email` - Verify email with token
- `POST /resend-verification` - Resend verification email
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /profile` - Get current user profile (requires auth)
- `PATCH /profile` - Update user profile (requires auth)

### Session Management (`/api/sessions`)
- `GET /` - List all user sessions (requires auth)
- `DELETE /:sessionId` - Revoke specific session (requires auth)
- `DELETE /` - Revoke all sessions except current (requires auth)

### Users (`/api/users`)
- Standard CRUD endpoints (requires appropriate permissions)

### Companies (`/api/companies`)
- Standard CRUD endpoints (requires appropriate permissions)

### API Documentation
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

## Testing Strategy

**Current Status:** No tests written yet

**Planned:**
- Unit tests: Jest for services, controllers
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright for critical user flows
- Database tests: In-memory SQLite or test PostgreSQL instance

**Priority Test Coverage:**
1. Authentication flows (register, login, refresh, logout)
2. Email verification and password reset
3. Session management
4. RBAC (roles and permissions)
5. Multi-tenant data isolation

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` or proper types)
- Interfaces over types for object shapes
- Enums from Prisma (use schema-generated enums)

### NestJS Conventions
- DTOs for all request/response data
- class-validator for validation
- class-transformer for serialization
- Guards for authentication/authorization
- Interceptors for logging, caching
- Decorators for reusable logic

### Database
- Always use Prisma for queries (no raw SQL unless necessary)
- Use transactions for multi-step operations
- Include error handling for unique constraints
- Soft delete instead of hard delete where applicable

### Error Handling
- Throw NestJS exceptions (NotFoundException, BadRequestException, etc.)
- Provide clear error messages
- Log errors with context
- Don't expose sensitive data in error responses

## Future Roadmap

### Phase 1: Authentication & Foundation ✅ COMPLETE
- User registration, login, email verification
- Password reset flow
- Session management
- Rate limiting and audit logging

### Phase 2: Core TMS Features (Next Priority)
1. **Fix schema mismatches** in disabled modules
2. **Shipment management** - Create, track, update shipments
3. **Route optimization** - Plan efficient routes
4. **Carrier integration** - Manage carrier services and rates
5. **Real-time tracking** - GPS tracking and status updates

### Phase 3: Advanced Features
- Billing and invoicing automation
- Analytics dashboards and reporting
- Mobile app for drivers
- Third-party carrier API integrations
- Advanced route optimization algorithms

### Phase 4: Enterprise Features
- Multi-company hierarchy (parent/child companies)
- White-label customization
- API for third-party integrations
- Webhooks for event notifications
- Advanced RBAC with custom permissions

## Important Context for Claude Code

### When Starting New Work:
1. **Always read `AI_HANDOFF.md` first** - See what changed recently
2. **Pull latest code** - `git pull origin main`
3. **Check backend status** - Is it running? Which modules are active?
4. **Review this file** - Understand architecture and decisions
5. **Update `AI_HANDOFF.md`** - Claim ownership of your work area

### Common Pitfalls to Avoid:
- **Don't re-enable disabled modules** without fixing schema mismatches
- **Don't use fields not in Prisma schema** - Check schema.prisma first
- **Don't create new models** without discussing with user
- **Don't skip email verification** in auth flows
- **Don't expose sensitive data** in API responses or logs
- **Don't use raw SQL** unless Prisma can't handle it

### User Preferences:
- User prefers **fixing bugs over documenting them**
- User wants **working code to test features**
- User values **clean commits and good git hygiene**
- User is collaborating with **ChatGPT Codex** - coordinate via AI_HANDOFF.md
- User uses **VS Code** with both Claude Code and ChatGPT Codex

### Communication Style:
- Be concise and technical
- Show code changes clearly
- Explain "why" for architectural decisions
- Provide file paths with line numbers for easy navigation
- Use markdown links for files: `[filename.ts](path/to/filename.ts)`

## Key Files to Reference

- **Schema:** `backend/prisma/schema.prisma` - Source of truth for database structure
- **Main App:** `backend/src/main.ts` - Bootstrap configuration
- **App Module:** `backend/src/app.module.ts` - Module registration
- **Auth Service:** `backend/src/api/auth/services/auth.service.ts` - Core auth logic
- **Environment:** `backend/.env` - Configuration (not in git)
- **AI Handoff:** `AI_HANDOFF.md` - Tactical coordination between AIs
- **This File:** `claude.md` - Strategic project context (you are here!)

## Quick Reference: Common Tasks

**Add new API endpoint:**
1. Create DTO in `dto/` folder
2. Add method to controller with decorators
3. Implement business logic in service
4. Add Swagger documentation with `@ApiProperty`
5. Test endpoint in Swagger UI

**Add new database model:**
1. Define model in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model_name`
3. Regenerate Prisma client: `npx prisma generate`
4. Create DTOs, controller, service for the model
5. Register module in `app.module.ts`

**Fix schema mismatch:**
1. Read the TypeScript error carefully
2. Check what fields exist in `prisma/schema.prisma`
3. Update service code to use correct field names
4. If field is needed, add it to schema and migrate
5. Test that module compiles and works

**Debug backend:**
1. Check if backend is running: `lsof -i :3000`
2. Check latest output: Use BashOutput tool on running process
3. Check Prisma schema: `backend/prisma/schema.prisma`
4. Check environment: `backend/.env`
5. Check logs: Audit logs in database, console output

---

## Summary for Quick Context Loading

**What:** Enterprise TMS for logistics operations
**Stack:** NestJS + Prisma + PostgreSQL (backend), React + TypeScript (frontend)
**Status:** Auth system complete and running. 6 modules disabled due to schema mismatches.
**Backend:** http://localhost:3000/api (running via `node dist/main.js`)
**Repo:** https://github.com/chinardeshpande/thg-tms
**Collaboration:** Claude Code + ChatGPT Codex via AI_HANDOFF.md
**Next Priority:** Fix schema mismatches in disabled modules (Shipments, Carriers, Routes, Tracking, Billing, Analytics)
**User Goal:** Build production-ready TMS with seamless AI collaboration workflow

---

*This file is maintained by Claude Code and should be updated when significant architectural decisions are made or project structure changes.*
