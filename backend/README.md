# ChefQueue Backend

Production backend for the existing ChefQueue React frontend: Express + MongoDB/Mongoose,
JWT auth, role-based authorization, and Socket.IO for real-time kitchen updates.

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string to Atlas / any MongoDB instance)
- npm

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit values as needed
npm run seed            # populates MongoDB with demo users, menu items, and sample orders
npm run dev              # starts the API on http://localhost:5000 with nodemon
```

## Environment variables (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/chefqueue
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AI_API_KEY=
```

- `MONGODB_URI` — point this at your local mongod or an Atlas cluster.
- `JWT_SECRET` — any long random string; used to sign/verify login tokens.
- `CLIENT_URL` — the Vite dev server origin, used for CORS and Socket.IO.
- `AI_API_KEY` — optional. If set, `/api/ai/ask` calls the Anthropic Messages API
  (`claude-sonnet-4-6`) grounded in live kitchen data. If unset, the endpoint falls back to a
  deterministic reply built from current MongoDB stats — it never errors out.

## Demo accounts (created by `npm run seed`)

| Role    | Email                  | Password  |
|---------|-------------------------|-----------|
| Admin   | admin@chefqueue.app     | admin123  |
| Chef    | chef@chefqueue.app      | chef123   |
| Cashier | cashier@chefqueue.app   | cashier123|

These are development/demo credentials only — change or remove them before any real deployment.

## API overview

All responses follow `{ success, data }` (or `{ success, data, pagination }` for lists) on
success, and `{ success: false, message }` on error.

| Area       | Routes |
|------------|--------|
| Auth       | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` |
| Menu       | `GET/POST /api/menu`, `GET/PUT/DELETE /api/menu/:id` |
| Orders     | `GET/POST /api/orders`, `GET/PUT/DELETE /api/orders/:id`, `PATCH /api/orders/:id/status` |
| Users      | `GET /api/users`, `GET/PUT/DELETE /api/users/:id`, `GET/PUT /api/users/me`, `PUT /api/users/me/password` |
| Dashboards | `GET /api/dashboard/admin`, `/chef`, `/cashier`, `/analytics` |
| AI         | `POST /api/ai/ask` |

Every route except `/api/auth/login` and `/api/auth/register` requires
`Authorization: Bearer <token>`. Admin-only, chef-only, and cashier-only routes are enforced
server-side via `requireRole()` — the frontend's route guards are a UX convenience only, not
the source of truth for permissions.

## Numeric IDs

The existing frontend was built around small numeric ids (`order.id`, `menuItem.id`,
`user.id`) — e.g. `orderCode()` does `#OQ-${String(id).padStart(4, '0')}`. Rather than
redesign the UI to work with Mongo ObjectIds, every collection keeps its own
auto-incrementing numeric `id` field (via `src/models/Counter.js`) alongside Mongo's internal
`_id`. All API routes and responses use this numeric `id`.

## Real-time updates (Socket.IO)

The server emits these events to all connected clients whenever orders change:

- `order:created`
- `order:updated`
- `order:statusChanged`
- `order:completed` (in addition to `order:statusChanged`, when status becomes `Completed`)
- `order:deleted`

Clients authenticate their socket connection by passing the JWT as `auth: { token }` on
connect (see the frontend's `SocketContext`).

## Business rules enforced server-side

- Menu items with `available: false` cannot be ordered.
- Order totals are always computed from current menu item prices — never trusted from the client.
- Only `chef`/`admin` can move orders through kitchen statuses; only `admin`/`cashier` can create orders or edit payment status; only `admin` can delete orders or users.
- Inactive users (`status: 'Inactive'`) cannot log in, even with the correct password.
- Duplicate emails are rejected at both the schema (unique index) and controller level.
- Passwords are bcrypt-hashed and never included in any API response.
- Deleting a menu item never breaks historical orders — each order item stores a snapshot of `name`/`price` at the time it was ordered.
- Self-registration can only create `chef` or `cashier` accounts; `admin` accounts must be created by an existing admin via the user-management API.

## Testing

No test framework is wired up, but the intended manual smoke test is:

```bash
# health check
curl http://localhost:5000/api/health

# login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chefqueue.app","password":"admin123"}'

# use the returned token for everything else
curl http://localhost:5000/api/menu -H "Authorization: Bearer <token>"
```

Then run the frontend against this backend and click through every route listed in the main
project README to confirm real data loads end-to-end.
