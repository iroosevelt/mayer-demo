# Mayer Demo Project - Solar Permit Automation POC

## Overview

This is a **working proof-of-concept** built specifically for the Mayer interview, demonstrating practical solutions to their two main technical challenges:

1. **AI Electrical Plan Review** - Using OpenAI GPT-4 Vision to analyze electrical plans
2. **Permit Automation** - HubSpot webhook-triggered automation workflow

## Quick Start

See **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** for detailed setup instructions.

**TL;DR:**

```bash
# Backend
cd backend
dotnet restore
dotnet user-secrets set "OpenAI:ApiKey" "your-key-here"
dotnet run

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Open http://localhost:5173
```

## What This Demonstrates

- **React + TypeScript** - Modern hooks, custom hooks, proper typing
- **.NET Core 8** - Clean architecture, dependency injection, async/await
- **OpenAI Integration** - GPT-4 Vision API, structured outputs, RAG-ready
- **API Design** - RESTful endpoints, error handling, validation
- **HubSpot Webhooks** - Event handling, automation triggers
- **Production Patterns** - Separation of concerns, error handling, extensibility

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React + TypeScript Frontend               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ PlanUpload  │  │ ReviewResults │  │  useAIReview │       │
│  │ Component   │  │  Component    │  │  Custom Hook │       │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                   │               │
│         └─────────────────┴───────────────────┘               │
│                           │                                   │
│                      ┌────▼─────┐                            │
│                      │ API.ts   │                            │
│                      └────┬─────┘                            │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTP/JSON
┌───────────────────────────▼───────────────────────────────────┐
│                .NET Core 8 Web API                            │
│  ┌─────────────────────┐        ┌──────────────────────┐     │
│  │ PlanReviewController│        │  WebhookController   │     │
│  └──────────┬──────────┘        └──────────┬───────────┘     │
│             │                                │                 │
│  ┌──────────▼──────────┐        ┌───────────▼──────────┐     │
│  │ PlanReviewService   │        │  (Future: Permit     │     │
│  └──────────┬──────────┘        │   Automation)        │     │
│             │                    └──────────────────────┘     │
│  ┌──────────▼──────────┐                                      │
│  │  OpenAIService      │                                      │
│  │  - GPT-4 Vision     │                                      │
│  │  - Structured output│                                      │
│  └─────────────────────┘                                      │
└───────────────────────────────────────────────────────────────┘
                            │
                   ┌────────▼─────────┐
                   │  OpenAI API      │
                   │  GPT-4 Vision    │
                   └──────────────────┘
```

## Project Structure

```
mayer-demo-project/
├── backend/                      # .NET Core 8 API
│   ├── Controllers/
│   │   ├── PlanReviewController.cs    # Main API endpoints
│   │   └── WebhookController.cs       # HubSpot webhooks
│   ├── Services/
│   │   ├── IOpenAIService.cs
│   │   ├── OpenAIService.cs           # GPT-4 Vision integration
│   │   ├── IPlanReviewService.cs
│   │   └── PlanReviewService.cs       # Business logic
│   ├── Models/
│   │   ├── PlanReview.cs              # Domain models
│   │   └── HubSpotWebhook.cs
│   ├── Program.cs                     # DI, CORS, startup
│   └── appsettings.json
│
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlanUpload.tsx        # File upload, preview
│   │   │   └── ReviewResults.tsx     # Results display
│   │   ├── hooks/
│   │   │   └── useAIReview.ts        # Custom hook
│   │   ├── services/
│   │   │   └── api.ts                # API client
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── README.md
└── SETUP-GUIDE.md               # Detailed setup instructions
```

## Key Features

### 1. AI Electrical Plan Review (Working!)

- Upload electrical plan image (JPG, PNG, etc.)
- GPT-4 Vision analyzes the image
- Extracts structured data:
  - Circuit count
  - Panel amperage
  - Service entrance location
  - Solar interconnection point
  - Proposed system size
- Checks against NEC codes (basic implementation)
- Returns compliance score (0-100)
- Flags plans that need human review

### 2. HubSpot Webhook Handler (Demonstrated)

- Receives webhook POST requests
- Detects deal closure events (`dealstage` → `closedwon`)
- Triggers automation workflow (logged, ready to extend)
- Demonstrates integration architecture

### 3. Production-Ready Patterns

- **Dependency Injection** - Services registered in DI container
- **Async/Await** - Proper async patterns throughout
- **Error Handling** - Try/catch, logging, proper HTTP status codes
- **Type Safety** - TypeScript on frontend, C# on backend
- **Separation of Concerns** - Controllers → Services → External APIs
- **Extensibility** - Easy to add caching, queuing, testing

## Technologies Used

| Layer       | Technology          | Why?                                   |
| ----------- | ------------------- | -------------------------------------- |
| Frontend    | React 18            | Modern, component-based, Mayer uses it |
| Language    | TypeScript          | Type safety, better DX                 |
| Build       | Vite                | Fast dev server, optimized builds      |
| Styling     | TailwindCSS         | Rapid UI development                   |
| Backend     | .NET Core 8         | Mayer's stack, great for APIs          |
| Language    | C# 12               | Modern features, async/await           |
| AI          | OpenAI GPT-4 Vision | Can analyze images directly            |
| Integration | HubSpot Webhooks    | Mayer's CRM                            |

## API Documentation

### Upload Plan

```http
POST /api/planreview/upload
Content-Type: application/json

{
  "imageBase64": "iVBORw0KGgoAAAANS...",
  "city": "Plano, TX"
}

→ 200 OK
{
  "reviewId": "abc-123",
  "status": "analyzing"
}
```

### Get Review Results

```http
GET /api/planreview/{reviewId}

→ 200 OK
{
  "id": "abc-123",
  "status": "completed",
  "analysis": {
    "complianceScore": 85,
    "requiresHumanReview": false,
    "violations": [...],
    ...
  }
}
```

Full API docs available at `/swagger` when backend is running.

## 🎓 What I Learned Building This

1. **GPT-4 Vision is powerful** - Can extract surprising detail from plans
2. **Structured outputs are crucial** - JSON mode makes responses parseable
3. **Base64 encoding is tricky** - Need to strip the MIME prefix

## Future Enhancements

If I had more time (or for production):

- [ ] **Vector Database** - Implement RAG with Pinecone for building codes
- [ ] **Playwright Integration** - Add permit automation adapters
- [ ] **Real-time Updates** - Replace polling with SignalR
- [ ] **File Upload to Cloud** - S3/Azure Blob instead of base64
- [ ] **User Authentication** - OAuth 2.0 / JWT
- [ ] **Database** - PostgreSQL for reviews, history
- [ ] **Testing** - Unit, integration, E2E tests
- [ ] **Monitoring** - Sentry for errors, Datadog for metrics
- [ ] **CI/CD** - GitHub Actions for automated deployment

**Technologies:** React • TypeScript • .NET Core 8 • OpenAI GPT-4 Vision
**Time to Build:** [72 hours]
**Ready to discuss:** Architecture, Trade-offs, Future improvements
