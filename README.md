# bebe-ims

Modernized successor codebase for the legacy Bloom retail platform, rebuilt under a new architecture while preserving legacy coverage.

## Repository Structure
- `backend/`: FastAPI service (routers/services/domain/schemas/models style)
- `app/`: React portal codebase retained for full UI flow continuity
- `pos/`: Android hybrid shell for Web POS hardware integration
- `legacy/`: frozen legacy source-of-truth imports (`bloom-api-final`, `bloom-portal-final`)
- `docs/`: discovery inventories, parity maps, DynamoDB model notes

## Development Commands

Run from the repository root unless noted otherwise.

```bash
make install
make build
make dev
make run
make up
make run-backend
make run-app
make checkpoint
make lint
make fmt
make test
```

- `make` at the root defaults to `make build` and builds backend + app.
- `make dev` starts backend and app together for local development.
- `make run` is the local instance shortcut and currently aliases `make dev`.
- `make up` is reserved for Docker Compose startup.
- `make run-backend` starts FastAPI on port `8001`.
- `make run-app` serves the React app on port `2306`.
- `make checkpoint` clears inventory quantity numbers first, then snapshots that cleared DB as the migrate-init baseline.

Module-local commands:

```bash
cd backend
make
make run
make migrate
make checkpoint
make test

cd ../app
make
make build
make run-dev

cd ../pos
make
make run
```

- `make` inside `backend/` defaults to the backend module build.
- `make` inside `app/` defaults to the React production build.
- `make` inside `pos/` defaults to the Android debug APK build, but requires Gradle and Android SDK tooling.
- `make run` means a local instance/runtime for each module.
- `make up` is used only for Docker/container startup where applicable.

`DEVELOPMENT.md` includes additional setup, run, lint, and formatter commands.

## Workflow Context

- `AGENTS.md` is the source-of-truth operating guide for future implementation agents.
- `DEVELOPMENT.md` is the local build/run workflow.
- `DEPLOY.md` is the AWS/CDK deployment workflow.
- `pos/README.md` and `pos/TEST_PLAN.md` cover the Android hybrid shell and physical device validation.

Core do/don't summary:

- Do preserve legacy behavior and existing visible controls unless removal is explicitly requested.
- Do keep API base configuration in environment settings.
- Do use local POS catalog cache for menu/scan lookup.
- Do keep inventory counts, checkout, and stock decrement backend-authoritative.
- Do not create a sale or decrement inventory from a QR scan.
- Do not put business rules in the Android wrapper.
- Do not claim APK/device validation without Android Studio/SDK and the physical Soonpos device.

## Discovery Outputs
- `docs/discovery/legacy-inventory.md`
- `docs/discovery/legacy-inventory.json`
- `docs/discovery/api-parity-matrix.csv`

## Backend Run
```bash
cd backend
make run
```

## Backend Run (docker compose)
```bash
docker compose up --build
```

## Deployment Commands

CDK/Lambda/API Gateway/CloudFront deployment uses `infra/cdk/deploy.env`.

```bash
cp infra/cdk/deploy.env.example infra/cdk/deploy.env
make deploy
make deploy-audit
make deploy-rollback
```

Useful aliases:

```bash
make deploy-cdk
make deploy-version-rollback
make deploy-docker
make deploy-backend
make deploy-app
```

- `make deploy` and `make deploy-cdk` deploy the AWS stack using `infra/cdk/deploy.py`.
- `make deploy-audit` reports stack/deployment state.
- `make deploy-rollback` cancels or recovers a failed stack operation.
- `make deploy-docker` is the legacy local Docker-style backend + app deployment path.

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
`app/` contains the React inventory portal and Web POS.

```bash
cd app
make install
make build
make run-dev
```

The app API base should come from environment configuration, especially:

```bash
REACT_APP_REST_API_ENDPOINT=http://localhost:8001/api/v1
```

## Hybrid Android POS

`pos/` contains the Android WebView shell for Soonpos hardware integration. The Web POS remains the source of truth for login, cart, checkout, receipts, inventory rules, and RBAC. The Android shell only provides native hardware access.

Current native bridge capabilities:

- loads `https://bebeinventory.net/web-pos`
- exposes `window.BebeHardware`
- binds the Soonpos printer AIDL service
- forwards hardware scanner broadcasts into Web POS
- skips hardware calls when Web POS runs in a normal browser

POS runtime cache:

- POS-user login preloads product, variant, and product-line listings into WebView/local browser storage.
- Web POS hydrates the menu from cache first to reduce startup latency and backend round trips.
- `REFRESH MENU` refreshes cached listings and the current site stock snapshot without clearing the in-progress cart.
- QR scan resolves from local cache first and uses backend lookup only as fallback.
- QR scan adds to the current in-progress cart only.
- Inventory counts, checkout, and stock deduction remain backend-authoritative.

Build and device validation:

```bash
cd pos
make
```

If Gradle or the Android SDK is not installed, open `pos/` in Android Studio:

1. Open the `pos/` project.
2. Sync Gradle.
3. Build the `app` debug variant.
4. Install/run on the Soonpos device.
5. Validate printer and scanner behavior using `pos/TEST_PLAN.md`.

The emulator can validate WebView loading and bridge presence only. Printer/scanner validation requires the physical Soonpos device because the vendor service and scanner broadcast app are device-local.

To change the Web POS target before building the APK, update:

```gradle
// pos/app/build.gradle
buildConfigField "String", "WEB_POS_URL", "\"https://bebeinventory.net/web-pos\""
buildConfigField "String", "ALLOWED_WEB_POS_HOSTS", "\"bebeinventory.net,www.bebeinventory.net\""
```

## Local Auth Mode (No SaaS Auth)
The app now uses local RBAC-backed users with hashed passwords.

- `admin` / `P@ssword1234!`
- `manager1` / `P@ss1234!`
- `site1` / `P@ss1234!`
- `site2` / `P@ss1234!`
- `site3` / `P@ss1234!`

Roles are `admin`, `manager`, and `user`. Users are login identities; employees are related person/employee records and are not synonymous with users.
