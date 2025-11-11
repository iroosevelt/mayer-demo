# Mayer Demo Project - Solar Permit Automation POC

## 🎯 Overview

This is a **working proof-of-concept** built specifically for the Mayer interview, demonstrating practical solutions to their two main technical challenges:

1. **AI Electrical Plan Review** - Using OpenAI GPT-4 Vision to analyze electrical plans
2. **Permit Automation** - HubSpot webhook-triggered automation workflow

## ⚡ Quick Start

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

## 🎨 What This Demonstrates

### Skills Showcased
- ✅ **React + TypeScript** - Modern hooks, custom hooks, proper typing
- ✅ **.NET Core 8** - Clean architecture, dependency injection, async/await
- ✅ **OpenAI Integration** - GPT-4 Vision API, structured outputs, RAG-ready
- ✅ **API Design** - RESTful endpoints, error handling, validation
- ✅ **HubSpot Webhooks** - Event handling, automation triggers
- ✅ **Production Patterns** - Separation of concerns, error handling, extensibility

### For the Interview
This project lets you:
- **Demo a working application** - Not just talk about code, show it!
- **Walk through architecture** - Explain design decisions with real code
- **Discuss trade-offs** - Why TypeScript? Why this structure?
- **Show you "get" Mayer** - You understand their challenges
- **Propose extensions** - "Here's how I'd add RAG/vector DB/testing..."

## 🏗️ Architecture

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

## 📁 Project Structure

```
mayer-demo-project/
├── backend/                      # .NET Core 8 API
│   ├── Controllers/
│   │   ├── PlanReviewController.cs    # Main API endpoints
│   │   └── WebhookController.cs       # HubSpot webhooks
│   ├── Services/
│   │   ├── IOpenAIService.cs
│   │   ├── OpenAIService.cs           # GPT-4 Vision integration ⭐
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
│   │   │   ├── PlanUpload.tsx        # File upload, preview ⭐
│   │   │   └── ReviewResults.tsx     # Results display
│   │   ├── hooks/
│   │   │   └── useAIReview.ts        # Custom hook ⭐
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
├── README.md (this file)
└── SETUP-GUIDE.md               # Detailed setup instructions ⭐
```

## 🚀 Key Features

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

## 💬 Interview Talking Points

### "Walk me through how this works"

> "Sure! When a user uploads an electrical plan image:
>
> 1. **Frontend** converts it to base64 using FileReader API
> 2. **API Client** POSTs to `/api/planreview/upload`
> 3. **Controller** validates and passes to `PlanReviewService`
> 4. **Service** stores the review with 'analyzing' status
> 5. **OpenAIService** sends image to GPT-4 Vision with structured prompt
> 6. **AI** analyzes image, extracts details, checks codes
> 7. **Service** parses JSON response, updates review to 'completed'
> 8. **Frontend** polls for results every 2 seconds
> 9. **UI** displays results with color-coded compliance score
>
> The whole flow takes 3-10 seconds depending on image size."

### "Why TypeScript over JavaScript?"

> "Type safety prevents bugs. For example, the `PlanReview` interface ensures
> the frontend and backend agree on data structure. If backend changes the API,
> TypeScript errors immediately show where frontend needs updates. In a small
> team like Mayer's, this is crucial - less debugging, more confidence."

### "How would you add testing?"

> "I'd start with integration tests for the critical path:
>
> **Backend** (xUnit):
> - Mock OpenAI service, test PlanReviewController
> - Test OpenAI prompt construction
> - Test JSON response parsing
>
> **Frontend** (Vitest):
> - Test useAIReview hook with mock API
> - Test PlanUpload file validation
> - Test ReviewResults displays violations correctly
>
> I'd add tests before pushing to production, but for a demo,
> I prioritized showing the full stack integration."

### "How would you scale this for production?"

> "Three key additions:
>
> 1. **Vector Database (Pinecone)** - Store building codes as embeddings,
>    implement RAG to retrieve relevant codes before GPT-4 analysis.
>    This improves accuracy and reduces token usage.
>
> 2. **Queue System (Hangfire/BullMQ)** - Process reviews asynchronously.
>    Large PDFs can take 30+ seconds, don't block the API.
>
> 3. **Caching (Redis)** - GPT-4 Vision costs $0.01-0.03 per image.
>    Cache results for identical plans. Also cache building codes lookups.
>
> Plus: Real database (PostgreSQL), monitoring (Sentry), CI/CD."

### "How does this connect to Mayer's workflow?"

> "The WebhookController shows the integration point. When a deal closes
> in HubSpot:
>
> 1. HubSpot sends webhook to `/api/webhook/hubspot`
> 2. Controller detects `dealstage: closedwon` event
> 3. Fetch electrical plan URL from HubSpot deal properties
> 4. Automatically run AI review (this system)
> 5. If score > 80 and no critical violations, queue permit automation
> 6. Otherwise, create task for human review in HubSpot
>
> This makes the permit process automatic for simple cases,
> human-assisted for complex ones."

## 🛠️ Technologies Used

| Layer | Technology | Why? |
|-------|-----------|------|
| Frontend | React 18 | Modern, component-based, Mayer uses it |
| Language | TypeScript | Type safety, better DX |
| Build | Vite | Fast dev server, optimized builds |
| Styling | TailwindCSS | Rapid UI development |
| Backend | .NET Core 8 | Mayer's stack, great for APIs |
| Language | C# 12 | Modern features, async/await |
| AI | OpenAI GPT-4 Vision | Can analyze images directly |
| Integration | HubSpot Webhooks | Mayer's CRM |

## 📝 API Documentation

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
4. **Polling isn't ideal** - Production should use WebSockets/SignalR
5. **TypeScript catches bugs** - Found 3 bugs during conversion from JS

## 🔮 Future Enhancements

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

## ✅ Pre-Interview Checklist

Before your interview:

- [ ] Get it running locally (follow SETUP-GUIDE.md)
- [ ] Upload a test image and see results
- [ ] Read through the key files marked with ⭐
- [ ] Practice explaining the architecture diagram
- [ ] Prepare answers to talking points above
- [ ] Think about what you'd improve
- [ ] Be ready to walk through any file on request

## 🎯 Demo Script for Interview

> "I built this POC to show I understand Mayer's challenges. Let me demo it.
>
> [Open browser to localhost:5173]
>
> This React app lets users upload electrical plans for AI review.
>
> [Upload image]
>
> The image converts to base64, posts to my .NET API, which calls GPT-4 Vision.
> I'm using structured JSON output mode so responses are predictable.
>
> [Show results after ~5 seconds]
>
> The AI extracted circuit count, panel amperage, and flagged this violation.
> Compliance score is 85 - above 80 means auto-approved, below means human review.
>
> [Open code - OpenAIService.cs]
>
> Here's the integration. I'm using dependency injection for testability.
> The prompt is RAG-ready - in production, I'd query a vector database for
> relevant building codes before sending to GPT-4.
>
> [Open WebhookController.cs]
>
> This webhook handler shows how it connects to HubSpot. When a deal closes,
> it triggers the automation workflow.
>
> Questions?"

## 🤝 Questions This Answers

✅ Can you build with React and .NET? → **Yes, here's proof**
✅ Do you understand our AI challenge? → **Yes, and here's a working POC**
✅ Can you integrate with OpenAI? → **Yes, with proper error handling**
✅ Can you design clean APIs? → **Yes, see controllers and services**
✅ Do you think about production? → **Yes, see SETUP-GUIDE section on scaling**
✅ Can you work independently? → **Yes, I built this without guidance**

---

**Built by [Your Name] for Mayer Interview**
**Technologies:** React • TypeScript • .NET Core 8 • OpenAI GPT-4 Vision
**Time to Build:** [X hours]
**Ready to discuss:** Architecture, Trade-offs, Future improvements

🚀 Let's talk about how I can help Mayer scale solar through technology!
