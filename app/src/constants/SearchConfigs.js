export const packageSearchConfig = [
  {
    fieldName: 'node.providerInfo.metrcPackageId',
    searchType: 'exact',
  },
  {
    fieldName: 'node.providerInfo.tag',
    searchType: 'exact',
  },
  {
    fieldName: 'node.providerInfo.metrcProduct.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.providerInfo.metrcProduct.category',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.facilityName',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.facilityLicense',
    searchType: 'exact',
  },
  {
    fieldName: 'node.producerName',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.producerLicense',
    searchType: 'exact',
  },
  {
    fieldName: 'node.source',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.brand.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.strain.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.labResult.testLabName',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.product.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.labResult.testStatus',
    searchType: 'fuzzy',
  },
]

export const productSearchConfig = [
  {
    fieldName: 'name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'salesType.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'inventoryId',
    searchType: 'exact',
  },
  {
    fieldName: 'packages.tags',
    searchType: 'exact',
  },
  {
    fieldName: 'packages.sources',
    searchType: 'fuzzy',
  },
]
