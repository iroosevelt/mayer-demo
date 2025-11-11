# Mayer Solar - Plan Review Demo (Frontend)

A modern React + TypeScript application for electrical plan review and solar permit management.

## Tech Stack

- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool
- **React Router 7.9** - Client-side routing
- **Tailwind CSS 3.4** - Styling
- **React Icons 5.5** - Icon library

## Features

✅ **Home Page**
- Hero section with energy cost calculator
- Service cards
- Feature cards (mobile responsive)
- Statistics display
- Testimonials
- Partner logos
- Mobile hamburger menu

✅ **Authentication**
- Login & Register pages
- JWT token-based authentication
- Protected routes
- Auth context provider

✅ **Dashboard**
- DashboardHome with responsive stats cards
- My Plans - view and manage electrical plans
- Upload Plan - drag & drop upload with AI analysis
- Appointments - book and manage inspections
- Profile - user settings and password change
- Fully mobile responsive across all pages

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Reduced header text sizes for better mobile UX
- Responsive padding, spacing, and icons

## Project Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── Dashboard/         # Dashboard layout
│   ├── Home/              # Home page components
│   ├── Layout/            # Main layout wrapper
│   ├── PageHeader.tsx     # Reusable page header
│   ├── StatCard.tsx       # Reusable stat card
│   ├── MobileMenu.tsx     # Mobile navigation
│   └── ...
├── pages/
│   ├── Auth/              # Login & Register
│   ├── Dashboard/         # Dashboard pages
│   └── Home.tsx           # Landing page
├── services/
│   └── api.ts             # API service layer
├── hooks/                 # Custom React hooks
├── data/                  # Static data
└── types.ts               # TypeScript types

public/
├── media/                 # Images and assets
└── partners/              # Partner logos
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api
```

For production, update `VITE_API_URL` to your production API endpoint.

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will run at `http://localhost:5173`

### Build

```bash
# Type check and build for production
pnpm build

# Preview production build locally
pnpm preview
```

Build output will be in the `dist/` directory (33MB total).

## Deployment Checklist

### ✅ Completed

- [x] Build passes with no TypeScript errors
- [x] All dashboard pages are mobile responsive
- [x] Reusable components created (PageHeader, StatCard)
- [x] Environment variables properly configured
- [x] .gitignore file added
- [x] No TODO/FIXME comments in code
- [x] Console logs minimized (only 1 console.log, 9 console.errors for error handling)
- [x] API calls use environment variable for base URL

### 📋 Before Deploying

1. **Environment Variables**
   - Create `.env` file with production API URL
   - Ensure `VITE_API_URL` points to production backend

2. **Backend API**
   - Ensure backend API is running and accessible
   - Verify CORS is configured for your frontend domain
   - Test all API endpoints

3. **Assets**
   - Verify all images in `public/` are optimized
   - Check partner logos are displaying correctly

4. **Testing**
   - Test all routes work correctly
   - Test authentication flow (login, register, logout)
   - Test protected routes redirect to login
   - Test mobile responsiveness on real devices
   - Test plan upload functionality
   - Test appointment booking
   - Test profile updates

5. **Production Build**
   - Run `pnpm build`
   - Test the build with `pnpm preview`
   - Check build size (current: ~285KB JS, ~47KB CSS)

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

### Option 3: Static Host (AWS S3, Cloudflare Pages, etc.)

```bash
# Build
pnpm build

# Upload dist/ folder to your static host
```

## Environment-Specific Configuration

The app uses `import.meta.env.VITE_API_URL` for the API base URL, which:
- Defaults to `http://localhost:5001/api` for development
- Can be overridden via `.env` file
- Should be set to production URL when deploying

## Known Issues

None currently. All features working as expected.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Mayer Solar
