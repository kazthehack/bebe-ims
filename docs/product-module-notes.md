# Product Module Notes

This documents the agreed implementation pattern for the Product domain so future modules follow the same end-to-end flow.

## Naming and Domain Pattern
- Object name uses domain noun with caps in design docs: `Product`.
- Backend files use domain naming:
  - `models/product.py`
  - `controllers/product.py`
  - `schemas/product.py`
  - `routers/v1/products.py`
- API routes follow REST resource naming:
  - `GET /api/v1/products`
  - `POST /api/v1/products`
  - `GET /api/v1/products/{id}`
  - `GET /api/v1/products/variants`
  - `POST /api/v1/products/variants`

## Backend Information Flow
1. Router accepts request and validates request/response via schema models.
2. Controller owns the business logic for the Product object.
3. Model defines typed DynamoDB payload (`ProductDocument`, `ProductVariantDocument`).
4. Router maps stored records to response schema.
5. Frontend receives typed JSON and renders list/show views.

## Frontend Information Flow
1. Hook (`hooks/products/useProductsApi.js`) owns API calls and transformation.
2. List page (`pages/products/ProductListPage.js`) renders table and opens modals.
3. Show page (`pages/products/ProductDetailPage.js`) renders product detail.
4. Modals are componentized under `pages/products/modals/`:
  - `AddProductModal.js`
  - `AddProductVariantModal.js`
5. Page prop types/defaults are in `ProductListPage.types.js`.

## UI Structure Rule
- Keep list page, show page, and modals as separate components.
- Avoid embedding business/data transform logic in view files; keep it in hooks/controllers.
- Keep endpoints real and wired end-to-end; mock values can exist in persisted records, not dummy route names.
