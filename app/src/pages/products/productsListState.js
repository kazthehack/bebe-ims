import { listPageStoreUtils } from 'contexts/ListPageContext'

export const PRODUCTS_LIST_CONTEXT_SCOPE = 'products'

export const readProductsListState = () => {
  return listPageStoreUtils.readScope(PRODUCTS_LIST_CONTEXT_SCOPE)
}

export const writeProductsListState = (nextState) => {
  listPageStoreUtils.writeScope(PRODUCTS_LIST_CONTEXT_SCOPE, nextState)
}

export const readProductsListStateFromSearch = (search) => {
  try {
    const params = new URLSearchParams(String(search || ''))
    const num = (key, fallback = 1) => {
      const parsed = Number(params.get(key) || fallback)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }
    return {
      activeTab: params.get('tab') || undefined,
      productsSearch: params.get('q') || undefined,
      productLineSearch: params.get('q_line') || undefined,
      variantSearch: params.get('q_variant') || undefined,
      productsPage: num('products_page', 1),
      productLinesPage: num('product_lines_page', 1),
      variantsPage: num('variants_page', 1),
      productsLineFilter: params.get('products_line') || undefined,
      productsIpFilter: params.get('products_ip') || undefined,
      productsFsnFilter: params.get('products_fsn') || undefined,
      variantsLineFilter: params.get('variants_line') || undefined,
      variantsProductFilter: params.get('variants_product') || undefined,
    }
  } catch (_err) {
    return {}
  }
}

export const toProductsListQuery = (state) => {
  const params = new URLSearchParams()
  const activeTab = String((state && state.activeTab) || 'products')
  const productsSearch = String((state && state.productsSearch) || '')
  const productLineSearch = String((state && state.productLineSearch) || '')
  const variantSearch = String((state && state.variantSearch) || '')
  const productsPage = Math.max(1, Number((state && state.productsPage) || 1))
  const productLinesPage = Math.max(1, Number((state && state.productLinesPage) || 1))
  const variantsPage = Math.max(1, Number((state && state.variantsPage) || 1))
  const productsLineFilter = String((state && state.productsLineFilter) || 'all')
  const productsIpFilter = String((state && state.productsIpFilter) || 'all')
  const productsFsnFilter = String((state && state.productsFsnFilter) || 'fast,normal,slow')
  const variantsLineFilter = String((state && state.variantsLineFilter) || 'all')
  const variantsProductFilter = String((state && state.variantsProductFilter) || 'all')

  params.set('tab', activeTab)
  params.set('products_page', String(productsPage))
  params.set('product_lines_page', String(productLinesPage))
  params.set('variants_page', String(variantsPage))
  if (productsSearch) params.set('q', productsSearch)
  if (productLineSearch) params.set('q_line', productLineSearch)
  if (variantSearch) params.set('q_variant', variantSearch)
  if (productsLineFilter !== 'all') params.set('products_line', productsLineFilter)
  if (productsIpFilter !== 'all') params.set('products_ip', productsIpFilter)
  if (productsFsnFilter !== 'fast,normal,slow') params.set('products_fsn', productsFsnFilter)
  if (variantsLineFilter !== 'all') params.set('variants_line', variantsLineFilter)
  if (variantsProductFilter !== 'all') params.set('variants_product', variantsProductFilter)

  return params.toString()
}
