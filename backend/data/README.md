## Migrate-Init Baseline

`migrate_init_baseline.json` is the preferred baseline for `make migrate-init` when present.

Create or refresh it from the current working DB:

Run:
```bash
make checkpoint
```

Behavior:
- clears inventory quantity numbers in the working DB first
- writes a timestamped baseline under `backend/backups/`
- writes the active baseline to `backend/data/migrate_init_baseline.json`
- the saved baseline already has product stock and supply stock quantity fields at zero

Important:
- `make migrate` does **not** run inventory import.
- `make migrate-init` restores `migrate_init_baseline.json` when present.
- `inventory_seed.xlsm` is the legacy fallback only when no baseline exists.
