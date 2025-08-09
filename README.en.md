# One API Hub

A lightweight web console for managing multiple One API compatible sites (e.g., New API, Veloera, VoAPI, OneHub). It supports unified login, site validation, user info and API key retrieval, daily check-in, and data import/export.

## Features

- Unified admin login with JWT (single-user)
- Site management: add/edit/delete
- Credential validation on create/update
- User info retrieval: username, quota, used quota, etc.
- API keys retrieval: key, used quota, remaining quota, etc.
- Daily check-in (auto-selects endpoint by site type)
- Data export/import (JSON)
- Dashboard metrics: total sites, total API keys, total quota and usage rate

### Tech Stack

- Frontend: React 18, Vite, TypeScript, Radix UI, Tailwind
- Backend: Node.js, Hono, @hono/node-server
- Database: SQLite (better-sqlite3)
- Security: bcryptjs (password hashing), jsonwebtoken (JWT)

### Quick Start (Development)

```bash
npm ci
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

Dev mode auto-creates SQLite at `./data/data.db` and a default admin:

- Username: `admin` (UI asks for password only)
- Initial password (dev): `admin123456`

### Build & Run (Production)

```bash
npm run build
npm start
# Serves API and static client on PORT (default 8000)
```

### Environment Variables

- `PORT`: server port (default `8000`)
- `NODE_ENV`: `development` or `production`
- `LOG_LEVEL`: log level (default `info`)
- `JWT_SECRET`: JWT signing secret (must be set securely in prod)
- `ADMIN_INITIAL_PASSWORD`: required on first production run to create admin
- `DB_PATH`: SQLite path in production (default `/data/data.db`); dev uses `./data/data.db`

Example `.env`:

```env
NODE_ENV=production
PORT=8000
LOG_LEVEL=info
JWT_SECRET=change-me-please
ADMIN_INITIAL_PASSWORD=your-strong-password
DB_PATH=/data/data.db
```

### Docker

```bash
docker build -t one-api-hub:latest .

docker run -d \
  --name one-api-hub \
  -p 8000:8000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=change-me-please \
  -e ADMIN_INITIAL_PASSWORD=your-strong-password \
  -e LOG_LEVEL=info \
  -v $(pwd)/data:/data \
  -v $(pwd)/logs:/app/logs \
  one-api-hub:latest
```

Then open `http://localhost:8000`.
