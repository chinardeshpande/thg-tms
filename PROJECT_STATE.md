# THG TMS - Project State Document
**Last Updated:** December 1, 2025
**Project Location:** `/Users/chinar.deshpande06/CD-THG/2025/THG-AI/MyCodingJourney/current-projects/thg-tms`

---

## 🎯 Project Overview

**THG Ingenuity Transport Management System (TMS)** is an enterprise-grade, full-stack web application for managing logistics operations including shipment tracking, fleet management, route planning, carrier management, and real-time IoT tracking.

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Leaflet + React-Leaflet (interactive maps)
- Lucide React (icons)
- Recharts (data visualization)

**Backend:**
- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL 15 (database)
- Passport.js (authentication)
- JWT tokens
- Swagger/OpenAPI (API documentation)

**Architecture:**
- Monorepo structure with separate frontend, backend, and shared packages
- RESTful API design
- Real-time IoT sensor integration
- Interactive map-based tracking

---

## 📁 Project Structure

```
thg-tms/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.tsx     # ✅ UPDATED - Black & white redesign
│   │   │   ├── ShipmentDetail.tsx
│   │   │   ├── LiveTracking.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ... (20+ pages)
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── layout/         # Layout components
│   │   │   └── map/            # Map components (Leaflet)
│   │   ├── contexts/           # React contexts
│   │   ├── styles/             # CSS files
│   │   └── App.tsx
│   ├── public/
│   │   └── screenshots/        # Product screenshots for landing page
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                     # NestJS backend
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   ├── shipments/          # Shipments module
│   │   ├── carriers/           # Carriers module
│   │   ├── routes/             # Routes module
│   │   ├── fleet/              # Fleet management module
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Database seeding
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                      # Shared TypeScript types/utilities
│   ├── src/
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                        # Documentation
│   ├── GETTING_STARTED.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── architecture/
│
├── README.md
├── QUICK_START.md
├── BUILD_COMPLETE.md
├── DEPLOYMENT_GUIDE.md
├── DEVELOPMENT_STATUS.md
├── PROJECT_SUMMARY.md
└── package.json                 # Root package.json for workspaces
```

---

## 🎨 Recent Changes - Landing Page Redesign

### Change Timeline (November 29 - December 1, 2025)

#### 1. **Initial Premium Redesign**
   - Transformed landing page from basic to enterprise-grade design
   - Added animated gradient backgrounds
   - Implemented premium badges with glassmorphism
   - Created floating orbs and glow effects
   - Enhanced typography with gradient text

#### 2. **Hero Section Transformation**
   - Changed from vertical stacked layout to side-by-side grid
   - **Left Column:** Product messages with rotating content
   - **Right Column:** Screenshot carousel with premium frame
   - Synchronized animations between messages and images
   - Centered carousel navigation dots below

#### 3. **Color Scheme Evolution**
   - **Phase 1:** Blue/indigo theme
   - **Phase 2:** Pink/fuchsia/magenta (THG Ingenuity colors) - ABANDONED
   - **Phase 3:** ✅ **Clean Black & White** (CURRENT)

#### 4. **Final Black & White Design**

**Key Design Elements:**
- **Backgrounds:** White, gray gradients, solid black sections
- **Text:** Gray-900 (headings), gray-700 (subheadings), gray-600 (body)
- **Accents:** Black buttons, gray hover states
- **Icons:** Black backgrounds with white icons
- **Cards:** White with gray borders, black border on hover
- **Trust Indicators:** Green checkmarks (only color accent)

**Sections Updated:**
- ✅ Header - Black branding, clean navigation
- ✅ Hero Section - Gray gradient background, black badges, black CTAs
- ✅ Benefits Section - Gray background
- ✅ Features Section - Black icon backgrounds, gray hover effects
- ✅ Capabilities Section - Black badges, gray-to-black icon transitions
- ✅ Industry Solutions - Gray cards
- ✅ Stats Section - Black background with white text
- ✅ Integrations Section - White background
- ✅ Security Section - Gray background
- ✅ Pricing Section - White background, black accents
- ✅ Final CTA - Black background with white/gray text
- ✅ Footer - White background

---

## 🗺️ Interactive Map Implementation

### Leaflet Integration (ShipmentRouteMap.tsx)

**Features Implemented:**
- Real-time GPS tracking visualization
- Custom markers for origin, destination, current location, waypoints
- Polyline routes (solid for traveled, dashed for remaining)
- Interactive popups with shipment details
- Pulsing circle animation around current location
- Automatic bounds fitting to show all points
- Browser chrome simulation for premium look

**Custom Icons:**
- 🏢 Origin - Green building icon
- 📍 Destination - Red map pin
- 🚛 Current Location - Blue truck icon (animated)
- 🧭 Waypoints - Purple navigation icons

**Data Integration:**
- Connected to ShipmentDetail page
- IoT sensor data integration
- Real-time coordinate updates
- Tracking history with timestamps

---

## 🚀 Features Implemented

### Core Modules

1. **Authentication & User Management**
   - JWT-based authentication
   - Role-based access control (Admin, Manager, Operator, Viewer)
   - Login/Register pages
   - Protected routes

2. **Shipment Management**
   - End-to-end shipment tracking
   - Multi-modal support (LTL, FTL, Parcel, Air, Ocean)
   - Real-time status updates
   - Interactive map tracking
   - IoT sensor integration
   - Digital proof of delivery
   - Exception handling

3. **Fleet Management**
   - Vehicle tracking
   - Driver management
   - Live GPS tracking page
   - Vehicle capacity planning
   - Yard management

4. **Route Planning**
   - Lane management
   - Multi-modal route optimization
   - Carrier rate comparison
   - Distance and transit time calculations
   - Active shipment monitoring per lane

5. **Carrier Management**
   - Multi-carrier network management
   - Performance tracking (ratings, on-time %)
   - Rate management
   - Service area monitoring
   - Contact management
   - Carrier scorecards

6. **Warehouse Operations**
   - Inbound receiving (ASN management)
   - Outbound shipping
   - Dock scheduling
   - Gate pass management
   - Loading management

7. **Analytics & Reporting**
   - Real-time dashboards
   - KPI tracking
   - Performance analytics
   - Custom visualizations (Recharts)

8. **IoT Integration**
   - GPS tracking
   - Temperature monitoring
   - Humidity sensors
   - Shock detection
   - Battery monitoring
   - Real-time sensor dashboards

---

## 📊 Database Schema (Prisma)

### Key Models

```prisma
- User (authentication, roles)
- Shipment (tracking, status, details)
- Carrier (company info, performance)
- Vehicle (fleet management)
- Driver (driver info)
- Route (lane management)
- InboundShipment (ASN, receiving)
- OutboundShipment (shipping, loading)
- DockAppointment (scheduling)
- Sensor (IoT data)
```

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15
- npm or yarn

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/thg_tms"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

### Installation & Running

```bash
# Install dependencies
npm install

# Database setup
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed

# Run development servers (from root)
npm run dev

# Or run individually
cd frontend && npm run dev    # http://localhost:5173
cd backend && npm run start:dev  # http://localhost:3001
```

### API Documentation
- Swagger UI: http://localhost:3001/api/docs

---

## 📝 Current Status

### ✅ Completed
- Full-stack architecture setup
- Authentication & authorization
- 20+ page components
- Interactive map integration (Leaflet)
- IoT sensor dashboard
- Shipment tracking with real-time updates
- Carrier management
- Fleet management
- Route planning
- Warehouse operations (inbound/outbound)
- Analytics dashboard
- Black & white landing page redesign
- Responsive mobile-first design

### 🚧 In Progress
- Backend API endpoints (partial implementation)
- Real-time WebSocket integration
- Advanced analytics features

### 📋 To Do
- Production deployment configuration
- Unit & integration tests
- Performance optimization
- Advanced reporting features
- Mobile app (future consideration)

---

## 🎯 Design Philosophy

### Landing Page Design Principles
1. **Clean & Professional:** Black and white color scheme with minimal accents
2. **Enterprise-Grade:** Premium UI elements, glassmorphism, shadows
3. **User-Focused:** Clear value propositions, trust indicators
4. **Responsive:** Mobile-first approach with breakpoints
5. **Performance:** Lazy loading, optimized images
6. **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation

### Component Architecture
- Reusable UI components (Button, Card, Input, etc.)
- Consistent design system
- TypeScript for type safety
- Props interfaces for all components
- Separation of concerns (pages, components, contexts)

---

## 🔗 Key Files Reference

### Frontend
- **Landing Page:** `frontend/src/pages/Landing.tsx` (1,425 lines)
- **Shipment Detail:** `frontend/src/pages/ShipmentDetail.tsx` (763 lines)
- **Live Tracking:** `frontend/src/pages/LiveTracking.tsx`
- **Map Component:** `frontend/src/components/map/ShipmentRouteMap.tsx` (239 lines)
- **App Router:** `frontend/src/App.tsx` (88 lines)
- **UI Components:** `frontend/src/components/ui/`

### Backend
- **Main Entry:** `backend/src/main.ts` (77 lines)
- **Database Schema:** `backend/prisma/schema.prisma`
- **Seed Data:** `backend/prisma/seed.ts` (108 lines)

### Configuration
- **Root Package:** `package.json` (workspace setup)
- **Frontend Package:** `frontend/package.json`
- **Backend Package:** `backend/package.json`
- **Git Ignore:** `.gitignore`

---

## 📚 Documentation Files

1. **README.md** - Project overview and setup
2. **QUICK_START.md** - Quick start guide
3. **BUILD_COMPLETE.md** - Build completion checklist
4. **DEPLOYMENT_GUIDE.md** - Deployment instructions
5. **DEVELOPMENT_STATUS.md** - Development progress tracker
6. **PROJECT_SUMMARY.md** - Detailed project summary
7. **PROJECT_STATE.md** - This file (current state)

---

## 🎨 Screenshot Requirements

The landing page references these screenshots (to be added):
- `/screenshots/route-planning.png`
- `/screenshots/live-tracking.png`
- `/screenshots/shipment-details.png`
- `/screenshots/carriers.png`
- `/screenshots/global-dashboard.png`
- `/screenshots/ai-optimization.png`
- `/screenshots/blockchain.png`
- `/screenshots/analytics.png`
- `/screenshots/iot-tracking.png`
- `/screenshots/architecture.png`
- `/screenshots/inbound-details.png`
- `/screenshots/notifications.png`

---

## 🔐 Security Considerations

- JWT authentication with secure secret
- Password hashing with bcrypt
- CORS configuration
- Helmet.js security headers
- Rate limiting
- Input validation
- SQL injection prevention (Prisma ORM)
- XSS protection

---

## 🚀 Performance Optimizations

- Lazy loading routes
- Code splitting (React.lazy)
- Vite build optimization
- Image optimization
- Debounced search inputs
- Memoized components
- Efficient re-renders

---

## 🎓 Learning Resources

### Technologies Used
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **NestJS:** https://nestjs.com
- **Prisma:** https://www.prisma.io
- **Tailwind CSS:** https://tailwindcss.com
- **Leaflet:** https://leafletjs.com
- **React Router:** https://reactrouter.com

---

## 📞 Support & Maintenance

### Development Practices
- Git version control
- Feature branch workflow
- Code reviews
- Testing before deployment
- Regular dependency updates

### Backup Recommendations
- Regular database backups
- Version control (Git)
- Environment variable backups
- Documentation updates

---

## 🎉 Project Highlights

1. **Comprehensive TMS Solution:** Full-featured transport management system
2. **Modern Tech Stack:** Latest React, NestJS, and PostgreSQL
3. **Real-Time Tracking:** Live GPS and IoT sensor integration
4. **Interactive Maps:** Leaflet-powered route visualization
5. **Enterprise Design:** Professional black & white landing page
6. **Scalable Architecture:** Monorepo with clean separation
7. **Type-Safe:** Full TypeScript implementation
8. **Responsive:** Mobile-first design approach

---

## 📝 Notes for Future Development

### Priority Tasks
1. Complete backend API endpoints
2. Add comprehensive testing (Jest, React Testing Library)
3. Implement WebSocket for real-time updates
4. Add screenshot images to landing page
5. Performance monitoring and optimization
6. Production deployment setup
7. CI/CD pipeline configuration

### Enhancement Ideas
- Multi-language support (i18n)
- Dark mode toggle
- Advanced filtering and search
- Export to PDF/Excel
- Email notifications
- SMS alerts
- Mobile app (React Native)
- Machine learning for route optimization

---

**Project Status:** Active Development
**Maintained By:** Chinar Deshpande
**License:** Proprietary
**Version:** 1.0.0-beta

---

*This document provides a comprehensive snapshot of the THG TMS project as of December 1, 2025. It should be updated regularly to reflect the current state of development.*
