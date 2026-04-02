# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Bonilla Tour's (Mobile App)
- **Type**: Expo (React Native)
- **Path**: `artifacts/bonilla-tours/`
- **Preview**: `/`
- **Description**: Bus ticket booking app for Durango → Guadalajara routes

### API Server
- **Type**: Express 5 API
- **Path**: `artifacts/api-server/`
- **Preview**: `/api`

## Bonilla Tour's Features

### Auth Flows
- Entry screen: Login / Create Account / Continue as Guest
- Full auth: AuthContext with persistent storage via AsyncStorage
- Guest mode: full booking flow without account, linked by email/phone
- Admin role: `admin@bonillatours.mx` / any password

### Screens
- `app/index.tsx` — Entry screen (Login/Register/Guest)
- `app/(auth)/login.tsx` — Login
- `app/(auth)/register.tsx` — Register
- `app/(tabs)/index.tsx` — Home / Trip search
- `app/(tabs)/my-trips.tsx` — Bookings (auth users + guest email lookup)
- `app/(tabs)/notifications.tsx` — Push/email notifications
- `app/(tabs)/profile.tsx` — Profile / account management
- `app/(tabs)/admin.tsx` — Admin panel (role-gated)
- `app/search-results.tsx` — Trip search results
- `app/seat-selection.tsx` — Interactive bus seat map
- `app/checkout.tsx` — Checkout with auto-fill for users, form for guests
- `app/booking-success.tsx` — Success screen with optional account creation CTA

### Data & State
- `contexts/AuthContext.tsx` — Auth state, login/register/logout/guest
- `contexts/BookingContext.tsx` — Booking state, AsyncStorage persistence
- `data/trips.ts` — Mock trip data (Durango → Guadalajara routes)

### Components
- `components/AppButton.tsx` — Animated press button
- `components/TripCard.tsx` — Trip listing card
- `components/BookingCard.tsx` — Booking card (supports admin view)
- `components/SeatMap.tsx` — Interactive bus seat map

### Design
- Theme: Deep blue primary (#1A56DB) with clean card surfaces
- Dark mode supported via `constants/colors.ts`
- Inter font family (400/500/600/700)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
