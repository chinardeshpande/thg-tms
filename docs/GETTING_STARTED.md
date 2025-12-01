# Getting Started with THG TMS

## Quick Start Guide

This guide will help you set up and run the THG Transport Management System on your local development environment.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Python** >= 3.10
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git**

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd thg-tms
```

### 2. Install Dependencies

Install dependencies for all workspaces (backend, frontend, shared):

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Backend service
- Frontend application
- Shared types/utilities

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following critical values:
- `JWT_SECRET` - Generate a secure random string
- `DATABASE_PASSWORD` - Set a strong password
- API keys for external services (optional for development)

### 4. Start Infrastructure Services

Start PostgreSQL, Redis, MongoDB, Kafka, and MQTT using Docker Compose:

```bash
npm run docker:up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- MongoDB on port 27017
- Kafka on ports 9092/9093
- Mosquitto MQTT on port 1883
- Zookeeper on port 2181

Verify services are running:

```bash
docker ps
```

### 5. Database Setup

Run database migrations:

```bash
cd backend
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

(Optional) Seed the database with sample data:

```bash
npm run seed
```

### 6. Start Development Servers

From the root directory, start both backend and frontend:

```bash
npm run dev
```

Or start them individually:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## Accessing the Application

Once started, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Prisma Studio**: `npx prisma studio` (from backend directory)

---

## Project Structure

```
thg-tms/
├── backend/              # NestJS backend service
│   ├── src/
│   │   ├── api/         # API routes, controllers, middleware
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   └── config/      # Configuration
│   ├── tests/           # Test files
│   └── prisma/          # Database schema and migrations
│
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom hooks
│   │   ├── contexts/    # React contexts
│   │   └── utils/       # Utilities
│   └── public/          # Static assets
│
├── shared/              # Shared types and utilities
│   ├── types/          # TypeScript types
│   ├── constants/      # Shared constants
│   └── validators/     # Validation schemas
│
├── database/            # Database scripts
│   ├── migrations/     # Migration files
│   ├── seeds/          # Seed data
│   └── scripts/        # Database utilities
│
├── docs/                # Documentation
│   ├── api/            # API documentation
│   ├── architecture/   # Architecture docs
│   └── deployment/     # Deployment guides
│
└── infrastructure/      # Infrastructure as code
    ├── docker/         # Docker configs
    ├── kubernetes/     # K8s manifests
    └── terraform/      # Terraform configs
```

---

## Development Workflow

### Making Changes

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Backend changes in `backend/src/`
   - Frontend changes in `frontend/src/`
   - Shared types in `shared/types/`

3. **Test your changes**
```bash
# Run tests
npm run test

# Run linting
npm run lint
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### Database Changes

When modifying the database schema:

1. Update the Prisma schema in `backend/prisma/schema.prisma`
2. Create a migration:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```
3. Generate the Prisma client:
```bash
npx prisma generate
```

### Adding New Dependencies

**Backend:**
```bash
cd backend
npm install package-name
```

**Frontend:**
```bash
cd frontend
npm install package-name
```

**Shared:**
```bash
cd shared
npm install package-name
```

---

## Common Tasks

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

### View Database

```bash
cd backend
npx prisma studio
```

### Check Docker Logs

```bash
# All services
npm run docker:logs

# Specific service
docker logs thg-tms-postgres
docker logs thg-tms-backend
```

### Stop All Services

```bash
npm run docker:down
```

### Build for Production

```bash
npm run build
```

---

## Testing

### Run All Tests

```bash
npm run test
```

### Run Backend Tests

```bash
cd backend
npm run test
npm run test:watch
npm run test:cov
```

### Run Frontend Tests

```bash
cd frontend
npm run test
npm run test:ui
```

### Run E2E Tests

```bash
cd backend
npm run test:e2e
```

---

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Ensure Docker containers are running:
```bash
docker ps
```

2. Check PostgreSQL logs:
```bash
docker logs thg-tms-postgres
```

3. Verify connection string in `.env`

### Module Not Found

Clear node_modules and reinstall:

```bash
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf shared/node_modules
npm install
```

### Prisma Issues

Regenerate Prisma client:

```bash
cd backend
npx prisma generate
```

---

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

Recommended settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Environment Variables

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing

### Optional Variables

- `GOOGLE_MAPS_API_KEY` - For maps functionality
- `THG_*_API_KEY` - For THG platform integration
- Carrier API keys (DHL, DPD, FedEx)

See `.env.example` for complete list.

---

## Next Steps

1. Read the [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md) document
2. Review the [Implementation Plan](./IMPLEMENTATION_PLAN.md)
3. Check the [API Documentation](http://localhost:3000/api/docs) once server is running
4. Join the development team standup
5. Pick a task from the Sprint board

---

## Getting Help

- Check the [Documentation](./docs/)
- Ask in team Slack channel: `#thg-tms-dev`
- Create an issue in GitHub
- Contact the Tech Lead

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google OR-Tools](https://developers.google.com/optimization)

---

**Happy coding! 🚀**
