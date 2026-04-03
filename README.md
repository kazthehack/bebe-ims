# bebe-ims

Modernized successor codebase for the legacy Bloom retail platform, rebuilt under a new architecture while preserving legacy coverage.

## Repository Structure
- `backend/`: FastAPI service (routers/services/domain/schemas/models style)
- `app/`: React portal codebase retained for full UI flow continuity
- `legacy/`: frozen legacy source-of-truth imports (`bloom-api-final`, `bloom-portal-final`)
- `docs/`: discovery inventories, parity maps, DynamoDB model notes

## Development Guide
- `DEVELOPMENT.md` includes setup, run, lint, and formatter commands for backend and app.

## Discovery Outputs
- `docs/discovery/legacy-inventory.md`
- `docs/discovery/legacy-inventory.json`
- `docs/discovery/api-parity-matrix.csv`

## Backend Run (local)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
```

## Backend Run (docker compose)
```bash
docker compose up --build
```

## FastAPI Surface
- Health: `GET /api/v1/health`
- Legacy objects (lossless payload persistence):
  - `GET /api/v1/entities`
  - `POST /api/v1/entities/{entity_type}`
  - `PUT /api/v1/entities/{entity_type}/{entity_id}`
  - `GET /api/v1/entities/{entity_type}/{entity_id}?tenant_id=...`
  - `GET /api/v1/entities/{entity_type}?tenant_id=...`
- Legacy workflow actions:
  - `GET /api/v1/workflows`
  - `POST /api/v1/workflows/{workflow}/{action}`

## App
`app/` currently preserves the full legacy UX surface while introducing REST bridge utilities in `app/src/api/client.js`.

## Local Auth Mode (No SaaS Auth)
For local deployment, auth is simplified and password-reset/verification flows are bypassed.

- Supported usernames: `admin`, `site1`, `site2`, `site3`
- Password for all users: `password`
- `/login/reset` and `/login/request` route back to the login form in local mode.
