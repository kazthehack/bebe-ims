export const buildProductInsightsSectionConfig = (variants) => {
  const safeVariants = Array.isArray(variants) ? variants : []

  return {
    title: 'Product Insights',
    subtitle: 'Variant sales and movement summary',
    series: safeVariants.map((variant) => ({
      label: variant.sku || variant.name || variant.id,
      value: Number(variant.sold_units || 0),
    })),
    columns: [
      { key: 'variant', label: 'Variant', width: '1.8fr' },
      { key: 'sku', label: 'SKU', width: '1.2fr' },
      { key: 'sold_units', label: 'Sold Units', width: '1fr' },
      { key: 'last_sold', label: 'Last Sold', width: '1fr' },
    ],
    rows: safeVariants.map((variant) => ({
      key: variant.id,
      variant: variant.name || 'N/A',
      sku: variant.sku || 'N/A',
      sold_units: Number(variant.sold_units || 0),
      last_sold: variant.last_sold || 'N/A',
    })),
    emptyChartText: 'No variant sales trend data yet.',
    emptyTableText: 'No variant sales data yet.',
  }
}
