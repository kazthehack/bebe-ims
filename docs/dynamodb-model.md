# DynamoDB Model (Single Table)

## Table
- Table name: `bebe_ims` (configurable)
- Primary key:
  - `PK` (partition key, string)
  - `SK` (sort key, string)

## Entity Storage Pattern
- `PK = TENANT#{tenant_id}`
- `SK = {ENTITY_TYPE}#{entity_id}`
- Shared attributes:
  - `entity_type`
  - `tenant_id`
  - `entity_id`
  - `payload` (lossless object payload map)
  - `created_at`
  - `updated_at`

## Workflow Event Pattern
- `PK = TENANT#{tenant_id}`
- `SK = WORKFLOW#{workflow}#{action}#{event_id}`
- Shared attributes:
  - `workflow`
  - `action`
  - `tenant_id`
  - `event_id`
  - `payload`
  - `created_at`

## Access Patterns
- List objects by type and tenant:
  - Query PK `TENANT#{tenant_id}` + begins_with(SK, `{ENTITY_TYPE}#`)
- Get object by tenant/type/id:
  - GetItem on PK + SK
- Record workflow invocation:
  - PutItem workflow row
- Audit workflow invocations:
  - Query PK + begins_with(SK, `WORKFLOW#{workflow}#`)

## Index Roadmap
- `GSI1PK = ENTITY_TYPE#{entity_type}`
- `GSI1SK = UPDATED_AT#{updated_at}`
- Enables cross-tenant operational analytics and admin listing by object class.
