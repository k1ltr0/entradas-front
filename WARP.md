# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the frontend for an event ticketing platform (Entradas) built as a dual-architecture system:
- **Static HTML pages**: Landing page with ticket purchase form (`index.html`, `login.html`, `dashboard.html`)
- **React admin dashboard**: Modern TypeScript React app in `dashboard-react/` for ticket management

The system serves a swimming event ("8ª edición de Aguas Abiertas Chile 2025") with category-based pricing and MercadoPago payment integration.

## Development Commands

### React Dashboard (Primary Development Area)
```bash
# Navigate to React app
cd dashboard-react

# Install dependencies
npm install

# Start development server (opens at localhost:3000)
npm run dev

# Run tests
npm test

# Run tests once without watching
npm test run

# Run tests for a specific file pattern
npm test -- App.test

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

### Static Pages (Root Level)
The HTML files in the root are served directly - no build process required. Use a local server for development:
```bash
# Simple HTTP server
python -m http.server 8000
# or
npx serve .

# Then visit http://localhost:8000
```

## Architecture

### API Integration
- **Backend URL**: `https://entradas-back-66181581846.europe-west1.run.app/api`
- **Authentication**: JWT tokens stored in localStorage (`authToken`, `tokenType`, `tokenExpiry`)
- **Key Endpoints**:
  - `POST /login` - Admin authentication
  - `GET /tickets` - Fetch all tickets (admin only)
  - `POST /purchase` - Create new ticket purchase
  - `GET /events` - Event management
  - `POST /tickets/resend-email` - Resend ticket emails

### React Dashboard Structure
```
dashboard-react/src/
├── App.tsx              # Main router with ProtectedRoute wrapper
├── components/
│   ├── Layout.tsx       # Common layout with sidebar/topbar
│   ├── Dashboard.tsx    # Main dashboard with stats and table
│   ├── Events.tsx       # Event management (create events/venues)
│   ├── Login.tsx        # Admin login form
│   ├── TicketsTable.tsx # Sortable/filterable ticket table
│   └── TicketDetailModal.tsx # Ticket details with resend email
```

### State Management
- **No external state library** - uses React useState/useEffect
- **URL state**: Ticket detail modal controlled via URL params (`?ticket=ID`)
- **Local storage**: Authentication tokens, no other persistence
- **Data flow**: Parent components fetch data, pass to children as props

### Routing
- `/login` - Admin authentication
- `/dashboard` - Main admin view (protected)
- `/events` - Event management (protected)
- All routes protected except login via `ProtectedRoute` component

## Key Features

### Ticket Purchase Flow (Static Pages)
1. User fills form on `index.html` with swimming event details
2. Category auto-calculated based on age/gender
3. Price determined by stage (preventa/general) + test type (individual/relevo)
4. Form submits to `/api/purchase` → redirects to MercadoPago checkout

### Admin Dashboard Features
- **Real-time stats**: Total sales, tickets, payment status breakdown
- **Ticket management**: View, filter, sort, export tickets
- **Ticket details**: Modal with full customer/event/payment info
- **Email resend**: Send ticket confirmation to custom email
- **Event management**: Create events with venues and schedules

### Data Models
```typescript
interface Ticket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: string | number;
  gender?: string;
  category?: string;        // Auto-calculated from age/gender
  distance?: number;        // 1000m or 2000m
  club?: string;
  test_type?: string;       // 'individual' | 'relevo'
  stage?: string;           // 'preventa' | 'general'
  price: number;
  payment_status: string;   // 'approved' | 'pending' | 'failed'
  purchase_date?: string;
  created_at?: string;
}
```

## Development Guidelines

### API Error Handling
All components implement consistent error handling:
- 401 responses → clear localStorage and redirect to login
- Network errors → show user-friendly messages
- Loading states for all async operations

### Component Patterns
- **Layout wrapper**: All protected pages use `<Layout>` component
- **Modal management**: URL-based state for ticket detail modal
- **Table interactions**: Click rows to view details, sortable headers
- **Form validation**: Client-side validation with server error display

### Styling
- **CSS-in-JS**: Component-specific CSS files (e.g., `Dashboard.css`)
- **Design system**: Shopify Admin-inspired color scheme and components
- **Responsive**: Mobile-friendly with collapsible sidebar
- **CSS custom properties**: Consistent theming via `:root` variables

### TypeScript Usage
- **Strict mode enabled** in `tsconfig.json`
- **Interface definitions**: Typed props and API responses
- **Type safety**: No `any` types, proper error handling types

## Testing

The project uses React Testing Library with Jest:
- Tests located in `dashboard-react/src/`
- Run with `npm test`
- `setupTests.js` configures jest-dom matchers

## Common Development Tasks

### Adding New Admin Page
1. Create component in `src/components/`
2. Add route in `App.tsx` wrapped with `ProtectedRoute`
3. Add navigation item in `Layout.tsx` sidebar
4. Follow existing patterns for API calls and error handling

### Modifying Ticket Purchase Form
Edit `index.html` - update categories/prices in JavaScript variables and form handling logic.

### Adding New API Endpoint Integration
1. Follow existing patterns in `Dashboard.tsx` or `Events.tsx`
2. Include proper authentication headers
3. Handle 401 responses for token expiry
4. Add loading states and error handling