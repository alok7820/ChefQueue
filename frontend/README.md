# ChefQueue — Restaurant Order Queue Management System

A frontend-only React (Vite) dashboard for managing restaurant orders across
Admin, Chef, and Cashier roles. Built with Tailwind CSS, React Router,
React Hook Form, Recharts, React Hot Toast, and Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

## Demo accounts

| Role    | Email                  | Password   |
|---------|-------------------------|------------|
| Admin   | admin@chefqueue.app     | admin123   |
| Chef    | chef@chefqueue.app      | chef123    |
| Cashier | cashier@chefqueue.app   | cashier123 |

## Notes

- All data is mocked in `src/data/mockData.js` and served through
  `src/services/*` with simulated network delay — no backend required.
- `src/services/api.js` has a real axios instance pre-wired (baseURL,
  auth header interceptor) so a real backend can be swapped in later.
- `SocketContext` simulates a live connection; swap in a real
  `socket.io-client` connection when a backend is available.
- The AI Assistant page is a local, canned-response demo — not connected
  to any AI API.
