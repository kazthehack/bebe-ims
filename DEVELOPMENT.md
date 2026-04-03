# Development Runbook

This runbook covers setup, app startup, lint, and formatter commands for both `backend` and `app`.

## Prerequisites

- Python `3.12+`
- Node.js `>=16` and npm or yarn
- Docker (optional, for local DynamoDB)

## Backend (FastAPI)

### 1. Install dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
```

### 2. Run backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### 3. Lint backend

```bash
ruff check app
```

### 4. Format backend

```bash
black app
ruff check app --fix
```

### 5. Backend test command

```bash
pytest
```

## App (React)

### 1. Install dependencies

```bash
cd app
yarn install
```

If you use npm:

```bash
npm install
```

### 2. Run app

```bash
yarn start
```

### 3. Lint app

```bash
yarn lint
```

### 4. Auto-fix lint issues

```bash
yarn lint:fix
```

### 5. Format app

```bash
yarn format
```

### 6. Check formatting in CI mode

```bash
yarn format:check
```

## Optional: Run backend + DynamoDB with Docker

From repository root:

```bash
docker compose up --build
```
