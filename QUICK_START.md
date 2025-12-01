# THG TMS - Quick Start

## 🚀 Get Running in 5 Minutes

### 1. Clone & Install (2 min)
```bash
cd current-projects/thg-tms
npm install
```

### 2. Configure Environment (1 min)
```bash
cp .env.example .env
# Edit .env - minimum required: DATABASE_URL, JWT_SECRET
```

### 3. Start Infrastructure (1 min)
```bash
npm run docker:up
```

### 4. Setup Database (30 sec)
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Start Development (30 sec)
```bash
cd ..
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Prisma Studio**: `npx prisma studio` (from backend/)

## 📦 What's Included

- ✅ Full project structure
- ✅ Docker Compose setup (Postgres, Redis, MongoDB, Kafka, MQTT)
- ✅ TypeScript types for all entities
- ✅ NestJS backend configuration
- ✅ React + Tailwind frontend setup
- ✅ THG Ingenuity theme
- ✅ Complete documentation

## 🛠 Common Commands

```bash
# Install all dependencies
npm install

# Start infrastructure services
npm run docker:up

# Start development servers (backend + frontend)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

## 📁 Project Structure

```
thg-tms/
├── backend/        # NestJS API
├── frontend/       # React app
├── shared/         # Shared types
├── database/       # Migrations
├── docs/           # Documentation
└── infrastructure/ # Docker, K8s
```

## 🎯 First Steps for Development

### Backend Developer
1. Read `docs/architecture/SYSTEM_ARCHITECTURE.md`
2. Review `backend/src/` structure
3. Check `shared/types/` for data models
4. Start with authentication module

### Frontend Developer
1. Review `frontend/src/` structure
2. Check Tailwind theme in `tailwind.config.js`
3. Review component structure
4. Start with authentication pages

### Full Stack Developer
1. Read all documentation in `docs/`
2. Review implementation plan
3. Pick a Sprint 1 task
4. Happy coding!

## 📚 Documentation

- [README.md](README.md) - Project overview
- [GETTING_STARTED.md](docs/GETTING_STARTED.md) - Detailed setup
- [SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) - Architecture
- [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) - 12-week plan
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - What's been built

## ❓ Need Help?

1. Check documentation in `docs/`
2. Review code comments
3. Ask team lead
4. Create GitHub issue

---

**You're ready to build! 🎉**
