## Inventory Seed File

Replace `inventory_seed.xlsm` with the latest inventory workbook.

Format:
1. v2 category-tab format:
- Sheets: `BEBESWEETS`, `BEBENTO`, `BEBEEATS`, `BEBEPLAYS`, `BEBECATS`, `BEBEDOGS`, `BEBEMONS`, `BEBESAURS`
- Header row contains:
`SKU`, `Item`, `Color / Variant`, `Display A`, `Display B`, `Display C`, `Back Stock`

Run:
```bash
cd backend
make migrate-init
```

Behavior:
- Import is overwrite-sync for seeded inventory objects.
- Previously seeded inventory objects missing from the new workbook are removed.
- Manually created non-seeded objects are left untouched.

Important:
- `make migrate` does **not** run inventory import.
- Use `make migrate-init` when you intentionally want workbook sync.
