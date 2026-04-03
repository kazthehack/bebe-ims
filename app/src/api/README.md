# API Layer

- `ObjectApi` maps domain object persistence into explicit REST routes: `/api/v1/{object}`.
- `AuthApi` maps authentication routes into explicit REST routes under `/api/v1/auth/*`.
- `imsBridge` adapts API responses into the existing UI contracts during migration.
