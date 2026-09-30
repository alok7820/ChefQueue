# ChefQueue

A restaurant order-queue management system: React frontend (unchanged in look and feel) now
backed by a real Express + MongoDB API with JWT auth, role-based authorization, and
Socket.IO real-time kitchen updates.

```
chefqueue/
├── frontend/             existing React app, mock services replaced with real API calls
└── backend/              Express + MongoDB API (see backend/README.md for full details)
```

## Prerequisites

- Node.js 18+
- MongoDB (local `mongod`, or an Atlas connection string)
- npm

## Run it

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env      # edit MONGODB_URI / JWT_SECRET / etc if needed
npm run seed                # seeds demo users, menu items, and sample orders
npm run dev                  # http://localhost:5000
```

**2. Frontend**

```bash
cd frontend/chefqueue
npm install
npm run dev                  # http://localhost:5173
```

The frontend already has `.env` / `.env.example` pointing at
`VITE_API_URL=http://localhost:5000/api` and `VITE_SOCKET_URL=http://localhost:5000` — change
these if your backend runs elsewhere.

## Demo accounts

| Role    | Email                 | Password   |
|---------|------------------------|------------|
| Admin   | admin@chefqueue.app    | admin123   |
| Chef    | chef@chefqueue.app     | chef123    |
| Cashier | cashier@chefqueue.app  | cashier123 |

(Development/demo credentials only — created by `npm run seed`, passwords are bcrypt-hashed in MongoDB.)

## What changed vs. the original mock build

- **Nothing in the UI was redesigned.** Every component, page, and route is the same; only
  the service layer (`src/services/*.js`) and two contexts (`AuthContext`, `SocketContext`)
  now talk to a real backend instead of an in-memory array.
- `src/data/mockData.js` is no longer imported for runtime data (orders, users, menu items).
  It's still used as the source for two static UI config lists — `CATEGORIES` and
  `AI_SUGGESTED_PROMPTS` — and as the seed data for the database (`backend/src/seed/seedDatabase.js`).
- Order/menu/user ids are still small numbers (`#OQ-0007`, etc.) exactly like before — the
  backend keeps its own auto-incrementing numeric `id` per collection (see
  `backend/README.md#numeric-ids`) specifically so `orderCode()` and other existing
  frontend code didn't need to change.
- The **Profile** page's "Edit profile" and "Change password" actions, which previously just
  faked a delay and showed a toast, are now wired to real `PUT /api/users/me` and
  `PUT /api/users/me/password` calls.
- Kitchen Queue, Chef Dashboard, Order Management, Cashier Orders/Payments, and both admin/
  cashier dashboards now subscribe to Socket.IO order events and refetch automatically —
  so if a cashier creates an order, the chef's queue updates without a manual refresh.
- The AI Assistant page now calls `POST /api/ai/ask`, which pulls live kitchen stats from
  MongoDB and (optionally) an LLM, instead of picking a canned string client-side.

## Verification performed

- Backend: all files pass `node --check`; the Express app was booted standalone and
  confirmed to respond correctly on `/api/health` and load every route file without error.
  I could not run a live MongoDB instance inside this sandbox (not installable here), so
  the database-dependent logic is carefully reviewed but not exercised end-to-end — please
  run `npm run seed` against your own MongoDB and click through the app before relying on it.
- Frontend: `npm run build` succeeds and `oxlint` reports zero new warnings/errors (only the
  same 3 pre-existing "fast refresh" notices from the original context files).

## Full endpoint list, business rules, and Socket.IO event names

See `backend/README.md`.
