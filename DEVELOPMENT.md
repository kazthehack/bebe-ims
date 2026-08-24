# Development Runbook

This runbook covers the local workflow for `backend`, `app`, and the hybrid Android `pos` shell.

Prefer the root `make` targets first. Module-level commands are available when you are intentionally working inside one folder.

## Prerequisites

- Python `3.12+`
- Node.js `>=16` and npm or yarn
- Docker (optional, for local DynamoDB)
- Android Studio or equivalent Gradle + Android SDK tooling (only for building/installing `pos/`)

## Root Workflow

From repository root:

```bash
make
make dev
make run
make up
make run-backend
make run-app
make lint
make fmt
make test
```

- `make` defaults to the full backend + app build.
- `make dev` starts backend + app together. Do not kill/restart a running instance unless the current task requires it.
- `make run` means local runtime and currently aliases `make dev`.
- `make up` is Docker Compose startup.
- `make run-backend` starts FastAPI.
- `make run-app` starts the React app.
- Run root `make` after implementation changes before handoff.

## Backend (FastAPI)

### Module commands

```bash
cd backend
make
make run
make up
make migrate
make test
make lint
make fmt
```

- `make` inside `backend/` defaults to compiling/building the backend module.
- `make run` starts the backend locally with reload.
- `make up` builds/runs the backend Docker container.
- Business logic belongs in controllers/domain/services, not view-layer code.
- Auth/password/hash behavior belongs in auth-focused modules.
- Permission/RBAC checks belong in permission-focused modules.

Manual equivalent:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## App (React)

### Module commands

```bash
cd app
make
make run
make up
make run-dev
make lint
make fmt
```

- `make` inside `app/` defaults to the React production build.
- `make run` serves the local production build.
- `make up` builds/runs the app Docker container.
- `make run-dev` starts hot reload.
- API base must come from `REACT_APP_REST_API_ENDPOINT`, not hardcoded view logic.
- Keep fetch/transform/cache logic in hooks/services/modules.

Important local env:

```bash
REACT_APP_REST_API_ENDPOINT=http://localhost:8001/api/v1
```

## Web POS Workflow

The Web POS is still the source of truth for cart, checkout, receipt creation, RBAC, and inventory rules.

Key expectations:

- QR scan adds to the current in-progress cart/receipt only.
- QR scan must not create a sale.
- Inventory must not decrement on scan.
- Sale/receipt creation and inventory decrement happen only at checkout.
- Product, variant, SKU, QR, and product-line listings are cached in WebView/local browser storage.
- Inventory counts are refreshed separately because they are volatile.
- `REFRESH MENU` refreshes cached menu/listing data and the current site stock snapshot without clearing the cart.

## Hybrid Android POS

```bash
cd pos
make
make run
```

The POS shell build requires Gradle and Android SDK tooling. If `make` reports missing tooling, open `pos/` in Android Studio and sync/build from there.
`make run` installs the debug APK to a connected Android device. `make up` is intentionally not defined for `pos` because there is no Docker runtime for the Android shell.

Device validation requires a physical Soonpos terminal for:

- vendor printer AIDL service
- hardware scanner broadcast app
- real printer/scanner behavior

An emulator can validate only WebView loading and the JavaScript bridge shape.

## Optional: Run backend + DynamoDB with Docker

From repository root:

```bash
docker compose up --build
```
