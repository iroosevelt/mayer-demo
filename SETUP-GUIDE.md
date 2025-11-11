# Mayer Demo Project - Setup Guide

This guide will walk you through setting up and running the demo project locally.

## Prerequisites

Make sure you have these installed:

- **Node.js** 18+ ([download](https://nodejs.org/))
- **.NET 8.0 SDK** ([download](https://dotnet.microsoft.com/download))
- **OpenAI API Key** ([get one](https://platform.openai.com/api-keys))
- **Code editor** (VS Code recommended)

## Quick Start (5 minutes)

### 1. Clone/Navigate to Project

```bash
cd /Users/bigtrouper/dev/0x/mayer-demo-project
```

### 2. Backend Setup

```bash
cd backend

# Restore .NET packages
dotnet restore

# Set your OpenAI API key (choose one method)

# Method 1: User Secrets (recommended for dev)
dotnet user-secrets set "OpenAI:ApiKey" "your-api-key-here"

# Method 2: Environment variable
export OpenAI__ApiKey="your-api-key-here"

# Method 3: appsettings.json (NOT recommended - don't commit!)
# Edit appsettings.json and add your key

# Run the backend
dotnet run
```

The API will start at `http://localhost:5000`
Swagger docs available at `http://localhost:5000/swagger`

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will start at `http://localhost:5173`

### 4. Test It!

1. Open your browser to `http://localhost:5173`
2. Upload an image of an electrical plan (or any image for testing)
3. Click "Upload & Analyze Plan"
4. Watch the AI analyze it!

---

## Project Structure

```
mayer-demo-project/
├── backend/                      # .NET Core API
│   ├── Controllers/
│   │   ├── PlanReviewController.cs    # Main API endpoints
│   │   └── WebhookController.cs       # HubSpot webhooks
│   ├── Services/
│   │   ├── OpenAIService.cs           # GPT-4 Vision integration
│   │   └── PlanReviewService.cs       # Business logic
│   ├── Models/
│   │   ├── PlanReview.cs              # Domain models
│   │   └── HubSpotWebhook.cs
│   ├── Program.cs                     # App entry point
│   └── MayerDemo.API.csproj
│
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlanUpload.tsx        # Upload interface
│   │   │   └── ReviewResults.tsx     # Results display
│   │   ├── hooks/
│   │   │   └── useAIReview.ts        # Custom hook for AI review
│   │   ├── services/
│   │   │   └── api.ts                # API client
│   │   ├── types.ts                  # TypeScript types
│   │   ├── App.tsx                   # Main app
│   │   └── main.tsx                  # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## API Endpoints

### Plan Review Endpoints

**Upload Plan for Review**

```
POST /api/planreview/upload
Content-Type: application/json

{
  "imageBase64": "base64-encoded-image",
  "city": "Plano, TX"
}

Response:
{
  "reviewId": "abc-123",
  "status": "analyzing"
}
```

**Get Review Status/Results**

```
GET /api/planreview/{reviewId}

Response:
{
  "id": "abc-123",
  "status": "completed",
  "createdAt": "2024-01-01T12:00:00Z",
  "analysis": {
    "details": {
      "circuitCount": 24,
      "panelAmperage": 200,
      ...
    },
    "violations": [...],
    "recommendations": [...],
    "complianceScore": 85,
    "requiresHumanReview": false
  }
}
```

**Get Recent Reviews**

```
GET /api/planreview?count=10
```

### Webhook Endpoints

**HubSpot Webhook Handler**

```
POST /api/webhook/hubspot
Content-Type: application/json

[
  {
    "objectType": "DEAL",
    "propertyName": "dealstage",
    "propertyValue": "closedwon",
    "objectId": 12345
  }
]
```

**Manual Permit Automation Trigger**

```
POST /api/webhook/permit-automation
Content-Type: application/json

{
  "dealId": 12345,
  "action": "START_PERMIT_PROCESS"
}
```

---

## Testing Without OpenAI API

If you don't have an OpenAI API key yet, you can test with a mock response:

1. **Backend**: Comment out the OpenAI call in `OpenAIService.cs` and return a mock `PlanAnalysis`:

```csharp
public async Task<PlanAnalysis> AnalyzeElectricalPlanAsync(string imageBase64, string? city = null)
{
    // Mock response for testing
    await Task.Delay(3000); // Simulate API delay

    return new PlanAnalysis
    {
        Details = new PlanDetails
        {
            CircuitCount = 24,
            PanelAmperage = 200,
            ServiceEntranceLocation = "North wall",
            SolarInterconnectionPoint = "Main panel",
            ProposedSolarSystemSize = 10
        },
        Violations = new List<CodeViolation>
        {
            new CodeViolation
            {
                CodeSection = "NEC 230.42",
                Description = "Example violation for demo",
                Severity = "medium"
            }
        },
        Recommendations = new List<string>
        {
            "Add surge protection per NEC 690.35",
            "Ensure proper bonding and grounding"
        },
        ComplianceScore = 85,
        RequiresHumanReview = false
    };
}
```

## Troubleshooting

### Backend won't start

- **Check .NET version**: `dotnet --version` (should be 8.0+)
- **Check port 5000**: Make sure nothing else is using it
- **Check API key**: Make sure you set the OpenAI API key

### Frontend won't start

- **Check Node version**: `node --version` (should be 18+)
- **Check port 5173**: Make sure it's available
- **Clear node_modules**: `rm -rf node_modules && npm install`

### CORS errors

- Make sure backend is running on port 5000
- Check `Program.cs` - CORS should allow `http://localhost:5173`

### OpenAI errors

- **Check API key**: Make sure it's valid
- **Check billing**: OpenAI account must have credits
- **Rate limits**: GPT-4 Vision has rate limits, wait a moment and retry
