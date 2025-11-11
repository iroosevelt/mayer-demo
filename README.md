# Mayer Demo Project - Solar Permit Automation

Full-stack application for solar permit management with AI-powered electrical plan review, user authentication, and appointment scheduling.

## Quick Start

See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for detailed instructions.

```bash
# Backend
cd backend
dotnet restore
dotnet user-secrets set "OpenAI:ApiKey" "your-key-here"
dotnet user-secrets set "Jwt:Key" "your-secret-key-here"
dotnet run

# Frontend
cd frontend
pnpm install
pnpm run dev

# Open http://localhost:5173
```

## Architecture

```
Frontend (React + TypeScript + React Router)
    ├── Public Pages (Home, Login, Register)
    ├── Protected Dashboard
    │   ├── Dashboard Home (Stats, Activity)
    │   ├── My Plans (Plan Management)
    │   ├── Upload Plan (AI Review)
    │   ├── Appointments (Scheduling)
    │   └── Profile (User Settings)
    └── Authentication (JWT, Protected Routes)
           │
           ↓ HTTP/JSON + JWT
Backend (.NET Core 8 + PostgreSQL)
    ├── AuthController (Registration, Login, JWT)
    ├── DashboardController (Stats, Activity)
    ├── UserController (Profile Management)
    ├── PlanReviewController → PlanReviewService → OpenAIService
    └── WebhookController (HubSpot Integration)
           │
           ↓
    PostgreSQL Database (Users, Plans, Appointments)
    OpenAI GPT-4 Vision API
```

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Role-based access control

### Dashboard
- User statistics (total plans, approved/pending counts, appointments)
- Recent activity feed
- Plan management interface
- Profile management

### AI Electrical Plan Review
- Upload electrical plan images
- GPT-4 Vision extracts circuit count, panel amperage, service entrance location, solar interconnection point, and system size
- NEC code compliance checking
- Compliance scoring and human review flagging

### Appointment Management
- Schedule and track appointments
- View upcoming appointments
- Appointment status tracking

### HubSpot Integration
- Webhook handler for deal events
- Automated permit workflow triggers

## API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Dashboard
```http
GET /api/dashboard/stats
GET /api/dashboard/activity
```

### Plan Review
```http
POST /api/planreview/upload
GET /api/planreview/{reviewId}
```

### User Management
```http
GET /api/user/profile
PUT /api/user/profile
```

Full API docs at `/swagger` when backend is running.

## Technologies

Frontend: React 18, TypeScript, Vite, TailwindCSS, React Router
Backend: .NET Core 8, C# 12, Entity Framework Core
Database: PostgreSQL
Authentication: JWT Bearer
AI: OpenAI GPT-4 Vision
Integration: HubSpot Webhooks
