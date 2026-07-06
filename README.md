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
make run-backend
make run-app
make lint
make fmt
make test
```

- `make` at the root defaults to `make build` and builds backend + app.
- `make dev` starts backend and app together for local development.
- `make run-backend` starts FastAPI on port `8001`.
- `make run-app` serves the React app on port `2306`.

Module-local commands:

```bash
cd backend
make
make run
make migrate
make test

cd ../app
make
make build
make run-dev

cd ../pos
make
```

- `make` inside `backend/` defaults to the backend module build.
- `make` inside `app/` defaults to the React production build.
- `make` inside `pos/` defaults to the Android debug APK build, but requires Gradle and Android SDK tooling.

`DEVELOPMENT.md` includes additional setup, run, lint, and formatter commands.

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
