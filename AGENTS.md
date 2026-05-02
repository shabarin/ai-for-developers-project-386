# Agent Instructions

## Project Overview

Kalenda — calendar booking API system with two roles: **Owner** (admin) and **Guest** (public). No authentication.

## Source of Truth

- **`main.tsp`** — TypeSpec specification. This is the single source of truth for all API definitions (models, routes, operations, examples).
- **Never edit** `tsp-output/schema/openapi.yaml` — it is auto-generated from `main.tsp`.

## Setup & Requirements

- **Node.js >= 24.14** is required (Prism CLI demands it). Use nvm: `nvm use 24`
- Package manager: npm

## Development Workflow

When making API changes:

1. Edit `main.tsp` (models, operations, `@example` decorators)
2. Compile: `npm run compile`
3. If the mock server is running, restart it: `npm run mock`

### Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile TypeSpec → OpenAPI (`tsp-output/schema/openapi.yaml`) |
| `npm run mock` | Start Prism mock server on `http://localhost:4010` |

#### Frontend Commands

Run from `frontend/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on `http://localhost:3000` |
| `npm run build` | Build frontend for production (output: `frontend/dist/`) |
| `npm run preview` | Preview production build locally |

## Prism Mock Server

- Runs on port **4010**
- Validates request bodies against OpenAPI schemas (returns `422` for invalid requests)
- Returns example data from `@example` decorators on models
- All 10 endpoints are available (6 admin, 4 public)

## Tech Stack

- **TypeSpec** v1.11 — API specification language (Microsoft)
- **Prism** v5.15 — mock server from OpenAPI spec (Stoplight)
- **OpenAPI 3.1** — generated output format
- **Go** v1.21+ — backend language (gorilla/mux router)

### Backend (Go)

- **gorilla/mux** v1.8.1 — HTTP router and URL matcher
- **In-memory storage** — thread-safe store with `sync.RWMutex`
- **No database** — state stored in memory (resets on restart)
- **Port**: 8080 (configurable via `PORT` env)
- **CORS**: configured for `http://localhost:3000`

### Frontend

- **Vite** v6 — fast dev server and build tool
- **React** v19 — UI library
- **TypeScript** v6 — type system
- **Mantine** v9 — UI component library
- **React Router** v7 — client-side routing
- **dayjs** — date manipulation library

## Key Conventions

- Routes prefixed with `/admin` (Owner) and `/public` (Guest)
- Request bodies use `@body` decorator to avoid `{ "body": ... }` wrapping in OpenAPI
- `duration` values are positive integers (15 or 30 minutes in examples)
- `utcDateTime` fields use ISO 8601 format

## Project Structure

```
main.tsp                          # Source of truth — TypeSpec API definition
tspconfig.yaml                    # TypeSpec compiler configuration
tsp-output/schema/openapi.yaml    # Generated OpenAPI spec (DO NOT EDIT)
package.json                      # Scripts and dependencies
DEVELOPMENT.md                    # Human-readable development guide

backend/                          # Go backend application
├── main.go                       # Entry point, router setup
├── go.mod                        # Go module definition
├── models/
│   └── models.go                 # Data models (EventType, Booking, Slot)
├── store/
│   └── store.go                  # In-memory storage (thread-safe)
├── handlers/
│   ├── admin.go                  # Admin API handlers
│   ├── public.go                 # Public API handlers
│   └── common.go                 # JSON responses, error helpers
└── utils/
    └── utils.go                  # ID generation, slot generation

frontend/                         # Frontend application
├── index.html                    # Entry HTML
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration (proxies to :8080)
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Main app with routing
│   ├── theme.ts                  # Mantine theme config
│   ├── types/                    # TypeScript types (from API)
│   ├── api/                      # API client and endpoints
│   ├── components/               # Reusable UI components
│   └── pages/                   # Page components (public + admin)
└── dist/                         # Production build output
```

## Frontend Development

### Prerequisites

- Node.js >= 22.12 (for Vite 6)
- Go >= 1.21 (for backend)
- Backend running: `cd backend && go run main.go`

### Quick Start

1. **Start Go backend** (terminal 1):
   ```bash
   cd /Users/ivan/edu/ai-for-developers/hands-on/ai-for-developers-project-386/backend
   go run main.go
   ```
   Backend runs on `http://localhost:8080`

2. **Start frontend** (terminal 2):
   ```bash
   cd /Users/ivan/edu/ai-for-developers/hands-on/ai-for-developers-project-386/frontend
   npm run dev
   ```
   Frontend dev server runs on `http://localhost:3000`

### Frontend Architecture

- **Public routes** (guest-facing):
  - `/` — Home page with available event types
  - `/book/:eventTypeId` — Booking page with calendar and form
  - `/booking/:id` — Booking confirmation

- **Admin routes** (owner-facing):
  - `/admin` — Event types list (CRUD)
  - `/admin/event-types/new` — Create event type
  - `/admin/event-types/:id/edit` — Edit event type
  - `/admin/bookings` — Upcoming bookings list

### API Connection

Frontend connects to Go backend at `http://localhost:8080` via Vite proxy.
Vite proxies `/api` requests to backend (configured in `frontend/vite.config.ts`).
Frontend API base URL is `/api` (see `frontend/src/api/client.ts`).
