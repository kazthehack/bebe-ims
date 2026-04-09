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

## Execution Guardrails (Hard Rules)
These rules are mandatory for every agent turn.

1. Preserve Existing Working Behavior
- Do not remove buttons, actions, routes, or flows unless the user explicitly requests removal.
- If refactoring layout, preserve all existing behavior first, then apply visual changes.
- Treat every existing visible action as in-scope regression surface.

2. No Scope Drift
- Implement only what was requested in the current instruction.
- If a request is visual/layout-only, do not alter backend logic or action availability.
- If a request is backend-only, do not alter page layout or control placement.

3. Template Compliance First
- Inventory/Product/Supplies/Sites must follow the established reusable page template.
- Do not introduce one-off page structures when equivalent reusable components exist.
- If a page diverges from template, fix to template before adding new enhancements.

4. Never Return Partial Work as Done
- If any requested sub-part is missing, continue implementation until complete.
- If uncertainty exists, default to preserving current behavior and ask only if truly blocked.
- Do not handoff with “mostly done” status.

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

8. Control Preservation Check
- Confirm that all previously available actions on the touched page still exist.
- Confirm button labels and positions still match the established template/playbook.
- Confirm existing modals still open, submit, and close correctly.

9. Request-to-Result Diff Check
- Verify output exactly reflects the user’s latest instruction text.
- Ensure no unrelated deletions or renames were introduced.
- If additional cleanup was performed, explicitly list it and justify it.

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

### Show Page Boilerplate Standard (Required)
All object detail/show pages must follow one reusable structure and behavior model.

1. Page Structure
- Section 1: Object details (2-column key/value layout).
- Section 2: Related objects table (with object-specific action buttons).
- Section 3: Insights section (graph + table component scaffold).

2. Required Controls
- Top-right actions must include `EDIT`, `SAVE`, `CANCEL`, and `DELETE` when object allows update/delete.
- `DELETE` must use confirmation modal with typed code confirmation.
- Related object creation should use reusable modal components.

3. Implementation Pattern
- Keep page-level API calls inside hooks (`useXxxDetail`, `useXxxApi`) and not inline in view components.
- Reuse shared components for details/table/analytics/modal rather than rebuilding layout per page.
- Do not re-invent the show layout per object; adapt labels/fields/content only.

4. Backend Contract Parity
- Each show page must map to real REST resources:
- `GET /api/v1/{resource}/{id}`
- `PUT /api/v1/{resource}/{id}` (if editable)
- `DELETE /api/v1/{resource}/{id}` (if deletable)
- Related object endpoints must also be real routes, not hardcoded mock-only JSX.

5. Done Criteria for New Show Pages
- Page inherits the standard 3-section layout.
- Edit flow is functional end-to-end.
- Delete flow is functional with safety confirmation.
- Related-object add flow is functional end-to-end.
- Root `make` passes after changes.

### Inventory Page Template (Required)
Use this exact structure for inventory detail pages unless user requests otherwise.

1. Description section
- Read-only object details using existing key/value detail template.

2. Inventory section
- Stock summary analytics block (same visual pattern used in Supplies).
- Action buttons for inventory operations (`Add`, `Dispense`, `Transfer` when transfer exists).
- Location stock table (`Location | Qty`) with storage and site rows.

3. Changes section
- Table-based audit list of stock movements.
- Human-readable change text (e.g., added to storage, dispensed to site).
- Empty state must render as an in-table row, not detached text.

4. Behavior constraints
- Keep transfer support if transfer endpoint exists.
- Do not relocate analytics to ad-hoc top-of-page blocks outside section template.
- Keep modal behavior consistent with shared modal controls.

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
- No removal of existing controls without explicit user instruction.
- No template-breaking one-off UI changes on established pages.
