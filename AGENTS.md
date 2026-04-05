# AGENTS.md

## Purpose
This document defines BAU operating standards for agents working on `bebe-ims`.
Use this as the source-of-truth workflow for future migration and implementation work.

## Product Direction
- This is a full modernization and system port from legacy.
- The migration principle is lossless behavior continuity.
- Port logic, workflows, validations, and UI flow intent.
- Do not selectively simplify or remove existing capability unless explicitly requested.

## Repository Layout
- `legacy/`: reference implementation (ignored by git).
- `backend/`: FastAPI + DynamoDB integration.
- `app/`: React frontend.
- Root contains shared commands and project-level files.

## Architecture Standards

### Backend
- Stack: FastAPI.
- Model-driven and domain-driven organization.
- Per-object implementation is preferred over generic catch-all abstractions.
- Use explicit routers and controllers per object/domain.
- Keep schemas meaningful and typed; avoid `Any` when concrete types are known.
- No placeholder-only controller/model/schema files.
- Swagger/OpenAPI must remain available from backend app.

### Data
- DynamoDB-native modeling and access patterns.
- Preserve object structure and intent from legacy.
- Avoid relational-only assumptions.

### Frontend
- Preserve existing page and workflow structure while modernizing implementation.
- API integration should be REST/FastAPI (no GraphQL dependency for new flow unless required).
- Keep UI behavior stable while improving reliability and maintainability.
- API base config must come from environment configuration, not hardcoded in view logic.

## BAU Workflow (Required)
1. Discovery
- Enumerate module scope before edits.
- Identify impacted models, controllers, schemas, routes, and UI flow.

2. Implement
- Make bounded changes with clear ownership by feature/page/object.
- Keep business logic in controller/domain layers.
- Keep view components focused on rendering; move API fetch/transform to hooks/modules.

3. Verify
- Run root `make` after each implementation pass.
- Fix compile/runtime blockers before handing back.
- Start services for runtime validation:
  - Preferred: `make dev` (runs backend + app in dev mode).
  - Alternative: `make run-backend` and `make run-app` in separate terminals.
- Validate changed route behavior with services actually running.

4. Report
- Summarize what changed and which files were touched.
- Include known blockers or required env config explicitly.

## Post-Change Checklist (Required)
After any implementation change, complete all items below before handoff:
1. Build verification
- Run root `make`.
- Do not mark work complete if build fails.

2. Route/UI smoke test
- Ensure services are running (`make dev` or split run commands) before smoke tests.
- Open and validate the affected route(s).
- Confirm expected content is visibly rendered.

3. API validation
- Verify expected endpoint calls appear in browser network panel.
- Confirm payload shape matches UI expectations.

4. Environment/config validation
- Confirm required env vars are documented (`.env.empty` and/or README).
- Avoid hidden hardcoded runtime config in view components.

5. Change summary
- Provide a concise list of changed files and behavior impact.
- Include any migration notes relevant to future agents.

6. Known issues and blockers
- Explicitly list unresolved issues, risks, or temporary mock behavior.
- Include exact next action to resolve each open item.

7. Regression awareness
- Identify nearby flows that might be affected by the change.
- Call out what was not tested.

## Conventions

### Coding
- Prefer explicit naming by object/domain.
- Avoid generic `entity/workflow` buckets for core business logic.
- Keep types strict and concrete.
- Keep comments short and only where non-obvious behavior exists.

### Frontend Integration
- Put data-fetch and transformation logic in hooks/services.
- Keep page components mostly presentational.
- Surface actionable error messages for failed endpoint calls.

### API
- Keep endpoint contracts stable and typed.
- For local mock/placeholder pages, wire through backend mock endpoints instead of hardcoded JSX data.

## Commands
- Root build check: `make`
- Root dev runtime: `make dev`
- Backend run: `make run-backend`
- App run: `make run-app`

## Environment
- App API base should be configured via `REACT_APP_REST_API_ENDPOINT` (in app env).
- Keep local defaults documented in env template files, not hardcoded in UI components.

## Non-Negotiables
- No silent scope reduction of legacy capability.
- No fake placeholder layers presented as complete logic.
- Do not return work as complete if build/run is broken.
