export const buildProductLineInsightsSectionConfig = (relatedProducts) => {
  const baseline = 140
  const rows = (relatedProducts || []).map((product, index) => {
    const units = Math.max(8, baseline - (index * 13))
    return {
      key: product.id,
      product: product.name || product.product_code || product.id,
      units_sold: units,
    }
  })

  const series = rows.map(row => ({
    label: String(row.product).slice(0, 10),
    value: row.units_sold,
  }))

  return {
    title: 'Product Line Insights',
    subtitle: 'Placeholder: products and their units sold',
    columns: [
      { key: 'product', label: 'Product', width: '1.6fr' },
      { key: 'units_sold', label: 'Units Sold', width: '1fr' },
    ],
    rows,
    series,
    emptyChartText: 'No products yet for charting.',
    emptyTableText: 'No products yet for units sold breakdown.',
  }
}
