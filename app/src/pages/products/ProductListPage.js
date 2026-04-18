import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import NoticeModal from 'components/reusable/modals/NoticeModal'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import WorkspaceTabs from 'components/reusable/layouts/WorkspaceTabs'
import CapacityBar from 'components/reusable/analytics/CapacityBar'
import { useProductsList } from 'hooks/products/useProductsApi'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import AddProductModal from './modals/AddProductModal'
import AddProductLineModal from './modals/AddProductLineModal'
import { PRICING_TIER_OPTIONS, defaultPriceForTier, displayLabelForTier } from './constants/pricingTiers'
import {
  CUSTOM_DESIGN_SOURCE_VALUE,
  DESIGN_SOURCE_OPTIONS,
} from './constants/designSources'
import { productListPageDefaultProps, productListPagePropTypes } from './ProductListPage.types'
import {
  PRODUCTS_LIST_STATE_KEY,
  readProductsListState,
  readProductsListStateFromSearch,
  toProductsListQuery,
} from './productsListState'

const linePrefix = (productLine) => {
  const cleaned = String(productLine || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!cleaned) return 'GEN'
  return cleaned.slice(0, 3)
}

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 0;
`

const TabPanel = styled.div`
  padding: 14px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`

const Button = styled.button`
  height: 38px;
  border: 1px solid ${({ $primary }) => ($primary ? '#25384c' : '#bec8d3')};
  background: ${({ $primary }) => ($primary ? '#25384c' : '#f0f3f6')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#41576d')};
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const ProductHeader = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1fr 1.3fr 0.8fr 0.9fr 0.9fr 1.1fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1fr 1.3fr 0.8fr 0.9fr 0.9fr 1.1fr 0.7fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
`

const ProductLineHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr 2fr 0.8fr 1fr 1fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ProductLineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr 2fr 0.8fr 1fr 1fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
`

const ProductVariantHeader = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.8fr 1.4fr 1.4fr 0.8fr 0.8fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ProductVariantRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.8fr 1.4fr 1.4fr 0.8fr 0.8fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 14px;
`

const CapacityCellWrap = styled.div`
  min-width: 120px;
`

const CapacityHeaderButton = styled.button`
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`


const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #25384c;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
`

const PaginationBar = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

const PaginationButton = styled.button`
  height: 30px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  min-width: 64px;
  cursor: pointer;
`

const PAGE_SIZE = 20
const DEFAULT_THRESHOLD_PER_SITE = 8

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const splitMultiline = (value) => (
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
)

const alpha = (value) => String(value || '').trim().toLowerCase()

const ProductListPage = ({ title }) => {
  const location = useLocation()
  const restoredState = {
    ...readProductsListState(),
    ...readProductsListStateFromSearch(location.search),
  }
  const history = useHistory()
  const [activeTab, setActiveTab] = useState(() => String(restoredState.activeTab || 'products'))
  const [showProductModal, setShowProductModal] = useState(false)
  const [showProductLineModal, setShowProductLineModal] = useState(false)
  const [showDeleteProductLineModal, setShowDeleteProductLineModal] = useState(false)
  const [showDeleteBlockedModal, setShowDeleteBlockedModal] = useState(false)
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false)
  const [showDeleteProductBlockedModal, setShowDeleteProductBlockedModal] = useState(false)
  const [productPendingDelete, setProductPendingDelete] = useState(null)
  const [productLinePendingDelete, setProductLinePendingDelete] = useState(null)
  const [formError, setFormError] = useState('')
  const [name, setName] = useState('')
  const [productLineId, setProductLineId] = useState('')
  const [category, setCategory] = useState('')
  const [listPrice, setListPrice] = useState('100')
  const [ip, setIp] = useState('')
  const [designSource, setDesignSource] = useState('')
  const [customDesignSource, setCustomDesignSource] = useState('')
  const [thirdPartySourceUrl, setThirdPartySourceUrl] = useState('')
  const [localWorkingFiles, setLocalWorkingFiles] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [productLineSearch, setProductLineSearch] = useState(() => String(restoredState.productLineSearch || ''))
  const [variantSearch, setVariantSearch] = useState(() => String(restoredState.variantSearch || ''))
  const [productsPage, setProductsPage] = useState(() => Math.max(1, Number(restoredState.productsPage || 1)))
  const [productLinesPage, setProductLinesPage] = useState(() => Math.max(1, Number(restoredState.productLinesPage || 1)))
  const [variantsPage, setVariantsPage] = useState(() => Math.max(1, Number(restoredState.variantsPage || 1)))
  const [productsLineFilter, setProductsLineFilter] = useState(() => String(restoredState.productsLineFilter || 'all'))
  const [productsIpFilter, setProductsIpFilter] = useState(() => String(restoredState.productsIpFilter || 'all'))
  const [variantsLineFilter, setVariantsLineFilter] = useState(() => String(restoredState.variantsLineFilter || 'all'))
  const [variantsProductFilter, setVariantsProductFilter] = useState(() => String(restoredState.variantsProductFilter || 'all'))
  const [capacitySort, setCapacitySort] = useState('none')

  const {
    allProducts,
    products,
    variants,
    loading,
    error,
    search,
    setSearch,
    storageCapacityByProductId,
    createProduct,
    deleteProduct,
    productLines,
    createProductLine,
    deleteProductLine,
  } = useProductsList()

  const initializedRef = React.useRef(false)
  React.useEffect(() => {
    if (initializedRef.current) return
    setSearch(String(restoredState.productsSearch || ''))
    initializedRef.current = true
  }, [restoredState.productsSearch, setSearch])

  const productNameById = useMemo(
    () => (allProducts || []).reduce((acc, item) => {
      acc[item.id] = item.name || item.product_code || item.id
      return acc
    }, {}),
    [allProducts],
  )

  const productById = useMemo(
    () => (allProducts || []).reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {}),
    [allProducts],
  )

  const productLineFilterOptions = useMemo(
    () => ['all', ...Array.from(new Set((allProducts || []).map((item) => String(item.product_line || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [allProducts],
  )

  const productIpOptions = useMemo(
    () => ['all', ...Array.from(new Set((allProducts || []).map((item) => String(item.ip || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [allProducts],
  )

  const productNameOptions = useMemo(
    () => ['all', ...Array.from(new Set((allProducts || []).map((item) => String(item.name || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [allProducts],
  )

  const filteredProducts = useMemo(
    () => (products || [])
      .filter((item) => {
        if (productsLineFilter !== 'all' && String(item.product_line || '') !== productsLineFilter) return false
        if (productsIpFilter !== 'all' && String(item.ip || '') !== productsIpFilter) return false
        return true
      })
      .sort((a, b) => {
        const lineCompare = alpha(a.product_line).localeCompare(alpha(b.product_line))
        if (lineCompare !== 0) return lineCompare
        const productCompare = alpha(a.name).localeCompare(alpha(b.name))
        if (productCompare !== 0) return productCompare
        return alpha(a.product_code || a.id).localeCompare(alpha(b.product_code || b.id))
      }),
    [products, productsLineFilter, productsIpFilter],
  )
  const sortedProducts = useMemo(() => {
    if (capacitySort === 'none') return filteredProducts
    const direction = capacitySort === 'asc' ? 1 : -1
    return filteredProducts.slice().sort((left, right) => {
      const leftThreshold = Math.max(1, Number(left.capacity_threshold_per_site || DEFAULT_THRESHOLD_PER_SITE))
      const rightThreshold = Math.max(1, Number(right.capacity_threshold_per_site || DEFAULT_THRESHOLD_PER_SITE))
      const leftTarget = leftThreshold * 4
      const rightTarget = rightThreshold * 4
      const leftGlobal = Number(storageCapacityByProductId[left.id] || 0)
      const rightGlobal = Number(storageCapacityByProductId[right.id] || 0)
      const leftRatio = leftGlobal / leftTarget
      const rightRatio = rightGlobal / rightTarget
      if (leftRatio !== rightRatio) return (leftRatio - rightRatio) * direction
      return alpha(left.name || left.product_code || left.id).localeCompare(alpha(right.name || right.product_code || right.id))
    })
  }, [filteredProducts, capacitySort, storageCapacityByProductId])

  const filteredVariants = useMemo(() => {
    const query = String(variantSearch || '').trim().toLowerCase()
    const searched = !query ? (variants || []) : (variants || []).filter((item) => (
      String(item.sku || '').toLowerCase().includes(query)
      || String(item.name || '').toLowerCase().includes(query)
      || String(productNameById[item.product_id] || '').toLowerCase().includes(query)
      || String(item.product_id || '').toLowerCase().includes(query)
    ))
    return searched
      .filter((item) => {
        const parent = productById[item.product_id]
        if (variantsLineFilter !== 'all' && String((parent && parent.product_line) || '') !== variantsLineFilter) return false
        if (variantsProductFilter !== 'all' && String((parent && parent.name) || '') !== variantsProductFilter) return false
        return true
      })
      .sort((a, b) => {
        const aCreated = Date.parse(String(a.created_at || ''))
        const bCreated = Date.parse(String(b.created_at || ''))
        const aTime = Number.isFinite(aCreated) ? aCreated : Number.POSITIVE_INFINITY
        const bTime = Number.isFinite(bCreated) ? bCreated : Number.POSITIVE_INFINITY
        if (aTime !== bTime) return aTime - bTime
        return alpha(a.sku || a.id).localeCompare(alpha(b.sku || b.id))
      })
  }, [variants, variantSearch, productNameById, productById, variantsLineFilter, variantsProductFilter])

  const productLineOptions = useMemo(
    () => productLines.map(line => ({ value: line.id, label: `${line.name} (${line.code})` })),
    [productLines],
  )

  const selectedProductLine = useMemo(
    () => productLines.find(line => line.id === productLineId) || null,
    [productLines, productLineId],
  )

  const designSourceOptions = useMemo(() => {
    const base = [...DESIGN_SOURCE_OPTIONS]
    const existingValues = Array.from(new Set(
      products
        .map((item) => String(item.design_source || '').trim())
        .filter(Boolean),
    ))
    existingValues.forEach((value) => {
      if (!base.some((option) => option.value === value)) {
        base.push({ value, label: value })
      }
    })
    return base
  }, [products])

  const filteredProductLines = useMemo(() => {
    const query = String(productLineSearch || '').trim().toLowerCase()
    if (!query) return productLines
    return productLines.filter(line => (
      String(line.code || '').toLowerCase().includes(query)
      || String(line.name || '').toLowerCase().includes(query)
      || String(line.description || '').toLowerCase().includes(query)
    ))
  }, [productLines, productLineSearch])

  React.useEffect(() => {
    if (!initializedRef.current) return
    setProductsPage(1)
  }, [search])

  React.useEffect(() => {
    if (!initializedRef.current) return
    setProductsPage(1)
  }, [productsLineFilter, productsIpFilter])

  React.useEffect(() => {
    if (!initializedRef.current) return
    setProductLinesPage(1)
  }, [productLineSearch])

  React.useEffect(() => {
    if (!initializedRef.current) return
    setVariantsPage(1)
  }, [variantSearch])

  React.useEffect(() => {
    if (!initializedRef.current) return
    setVariantsPage(1)
  }, [variantsLineFilter, variantsProductFilter])

  React.useEffect(() => {
    if (!initializedRef.current) return
    if (activeTab === 'products') setProductsPage(1)
    if (activeTab === 'product-lines') setProductLinesPage(1)
    if (activeTab === 'variants') setVariantsPage(1)
  }, [activeTab])

  const listStateForQuery = useMemo(() => ({
    activeTab,
    productsSearch: search,
    productLineSearch,
    variantSearch,
    productsPage,
    productLinesPage,
    variantsPage,
    productsLineFilter,
    productsIpFilter,
    variantsLineFilter,
    variantsProductFilter,
  }), [
    activeTab,
    search,
    productLineSearch,
    variantSearch,
    productsPage,
    productLinesPage,
    variantsPage,
    productsLineFilter,
    productsIpFilter,
    variantsLineFilter,
    variantsProductFilter,
  ])

  const listQuery = useMemo(
    () => toProductsListQuery(listStateForQuery),
    [listStateForQuery],
  )

  React.useEffect(() => {
    if (!initializedRef.current) return
    try {
      window.sessionStorage.setItem(PRODUCTS_LIST_STATE_KEY, JSON.stringify(listStateForQuery))
    } catch (_err) {
      // ignore storage failures
    }
  }, [listStateForQuery])

  const productsTotalPages = Math.max(1, Math.ceil((sortedProducts || []).length / PAGE_SIZE))
  const safeProductsPage = Math.min(productsPage, productsTotalPages)
  const pagedProducts = (sortedProducts || []).slice((safeProductsPage - 1) * PAGE_SIZE, safeProductsPage * PAGE_SIZE)

  const productLinesTotalPages = Math.max(1, Math.ceil((filteredProductLines || []).length / PAGE_SIZE))
  const safeProductLinesPage = Math.min(productLinesPage, productLinesTotalPages)
  const pagedProductLines = (filteredProductLines || []).slice((safeProductLinesPage - 1) * PAGE_SIZE, safeProductLinesPage * PAGE_SIZE)

  const variantsTotalPages = Math.max(1, Math.ceil((filteredVariants || []).length / PAGE_SIZE))
  const safeVariantsPage = Math.min(variantsPage, variantsTotalPages)
  const pagedVariants = (filteredVariants || []).slice((safeVariantsPage - 1) * PAGE_SIZE, safeVariantsPage * PAGE_SIZE)

  const skuPreview = useMemo(() => {
    const lineCodeOrName = (
      (selectedProductLine && (selectedProductLine.code || selectedProductLine.name)) || ''
    )
    const prefix = linePrefix(lineCodeOrName)
    let maxNumber = 0
    products.forEach((item) => {
      const code = String(item.product_code || item.sku || '')
      if (!code.startsWith(`${prefix}-`)) return
      const next = code.split('-', 2)[1]
      if (!next) return
      const parsed = Number(next)
      if (Number.isFinite(parsed)) maxNumber = Math.max(maxNumber, parsed)
    })
    return `${prefix}-${String(maxNumber + 1).padStart(5, '0')}`
  }, [selectedProductLine, products])

  const handleCreateProduct = async () => {
    setFormError('')
    if (!productLineId.trim() || !name.trim()) {
      setFormError('Product Line and Product Name are required.')
      return
    }
    if (designSource === CUSTOM_DESIGN_SOURCE_VALUE && !customDesignSource.trim()) {
      setFormError('Custom Design Source is required when Custom is selected.')
      return
    }
    try {
      const resolvedDesignSource = designSource === CUSTOM_DESIGN_SOURCE_VALUE
        ? customDesignSource.trim()
        : designSource.trim()
      await createProduct({
        name: name.trim(),
        product_line_id: productLineId.trim(),
        ip: ip.trim() || null,
        category: category.trim() || null,
        list_price: Number(listPrice || 0),
        design_source: resolvedDesignSource || null,
        third_party_source_url: thirdPartySourceUrl.trim() || null,
        local_working_files: splitMultiline(localWorkingFiles),
        image_url: imageUrl.trim() || null,
      })
      setName('')
      setProductLineId('')
      setIp('')
      setCategory('')
      setListPrice('100')
      setDesignSource('')
      setCustomDesignSource('')
      setThirdPartySourceUrl('')
      setLocalWorkingFiles('')
      setImageUrl('')
      setShowProductModal(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create product.')
    }
  }

  const handleChangeTier = (tier) => {
    setCategory(tier)
    const defaultPrice = defaultPriceForTier(tier)
    setListPrice(String(defaultPrice !== null ? defaultPrice : 100))
  }

  const handleOpenDeleteProductLine = (line) => {
    setProductLinePendingDelete(line)
    setShowDeleteProductLineModal(true)
  }

  const handleOpenDeleteProduct = (product) => {
    setProductPendingDelete(product)
    setShowDeleteProductModal(true)
  }

  const handleDeleteProductLine = async (line) => {
    try {
      await deleteProductLine(line.id)
      setShowDeleteProductLineModal(false)
      setProductLinePendingDelete(null)
    } catch (err) {
      const message = String(err && err.message ? err.message : '')
      if (message.includes('409')) {
        setShowDeleteProductLineModal(false)
        setProductLinePendingDelete(null)
        setShowDeleteBlockedModal(true)
        return
      }
      throw err
    }
  }

  const handleDeleteProduct = async (product) => {
    try {
      await deleteProduct(product.id)
      setShowDeleteProductModal(false)
      setProductPendingDelete(null)
    } catch (err) {
      const message = String(err && err.message ? err.message : '')
      if (message.includes('409')) {
        setShowDeleteProductModal(false)
        setProductPendingDelete(null)
        setShowDeleteProductBlockedModal(true)
        return
      }
      throw err
    }
  }

  const cycleCapacitySort = () => {
    setCapacitySort((prev) => {
      if (prev === 'none') return 'desc'
      if (prev === 'desc') return 'asc'
      return 'none'
    })
  }

  const breadcrumbItems = activeTab === 'products'
    ? [{ label: title }]
    : [{ label: title, to: `/products?${listQuery}` }, { label: activeTab === 'variants' ? 'Product Variants' : 'Product Lines' }]

  return (
    <PageContent title={<BreadcrumbTitle items={breadcrumbItems} />}>
      <Surface>
        <WorkspaceTabs
          ariaLabel="Product workspace tabs"
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: 'products', label: 'Products' },
            { key: 'variants', label: 'Product Variants' },
            { key: 'product-lines', label: 'Product Lines' },
          ]}
        />

        {activeTab === 'products' && (
          <TabPanel id="products-panel" role="tabpanel" aria-labelledby="products-tab">
            <Toolbar>
              <ListFiltersRow
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search products"
                filters={[
                  {
                    key: 'products-line',
                    value: productsLineFilter,
                    onChange: setProductsLineFilter,
                    options: [
                      { value: 'all', label: 'All Product Lines' },
                      ...productLineFilterOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
                    ],
                  },
                  {
                    key: 'products-ip',
                    value: productsIpFilter,
                    onChange: setProductsIpFilter,
                    options: [
                      { value: 'all', label: 'All IP' },
                      ...productIpOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
                    ],
                  },
                ]}
              />
              <div>
                <Button $primary type="button" onClick={() => setShowProductModal(true)}>Add Product</Button>
              </div>
            </Toolbar>

            <Table>
              <ProductHeader>
                <div>Product ID</div>
                <div>Product Line</div>
                <div>Name</div>
                <div>IP</div>
                <div>Pricing Tier</div>
                <div>List Price</div>
                <div>
                  <CapacityHeaderButton type="button" onClick={cycleCapacitySort}>
                    Capacity
                  </CapacityHeaderButton>
                </div>
                <div>Actions</div>
              </ProductHeader>

              {loading && <Meta>Loading products...</Meta>}
              {!loading && pagedProducts.map(item => {
                const thresholdPerSite = Math.max(1, Number(item.capacity_threshold_per_site || DEFAULT_THRESHOLD_PER_SITE))
                const capacityTarget = thresholdPerSite * 4
                const globalCapacity = Number(storageCapacityByProductId[item.id] || 0)
                return (
                <ProductRow key={item.id}>
                  <Cell>{item.product_code || item.sku || item.id}</Cell>
                  <Cell>{item.product_line || 'N/A'}</Cell>
                  <Cell>{item.name}</Cell>
                  <Cell>{item.ip || 'N/A'}</Cell>
                  <Cell>{displayLabelForTier(item.category)}</Cell>
                  <Cell>{money(item.list_price)}</Cell>
                  <Cell>
                    <CapacityCellWrap>
                      <CapacityBar value={globalCapacity} target={capacityTarget} />
                    </CapacityCellWrap>
                  </Cell>
                  <Cell>
                    <Actions>
                      <ActionButton type="button" onClick={() => history.push(`/products/${item.id}?${listQuery}`)}>VIEW</ActionButton>
                      <span>|</span>
                      <ActionButton type="button" onClick={() => handleOpenDeleteProduct(item)}>DELETE</ActionButton>
                    </Actions>
                  </Cell>
                </ProductRow>
                )
              })}
            </Table>
            {!loading && filteredProducts.length > 0 && (
              <PaginationBar>
                <Meta>Page {safeProductsPage} / {productsTotalPages}</Meta>
                <PaginationButton type="button" onClick={() => setProductsPage((prev) => Math.max(1, prev - 1))} disabled={safeProductsPage <= 1}>
                  Prev
                </PaginationButton>
                <PaginationButton type="button" onClick={() => setProductsPage((prev) => Math.min(productsTotalPages, prev + 1))} disabled={safeProductsPage >= productsTotalPages}>
                  Next
                </PaginationButton>
              </PaginationBar>
            )}
          </TabPanel>
        )}

        {activeTab === 'product-lines' && (
          <TabPanel id="product-lines-panel" role="tabpanel" aria-labelledby="product-lines-tab">
            <Toolbar>
              <ListFiltersRow
                searchValue={productLineSearch}
                onSearchChange={setProductLineSearch}
                searchPlaceholder="Search product lines"
              />
              <div>
                <Button $primary type="button" onClick={() => setShowProductLineModal(true)}>Add Product Line</Button>
              </div>
            </Toolbar>

            <Table>
              <ProductLineHeader>
                <div>Code</div>
                <div>Name</div>
                <div>Description</div>
                <div>Products</div>
                <div>Updated</div>
                <div>Actions</div>
              </ProductLineHeader>

              {loading && <Meta>Loading product lines...</Meta>}
              {!loading && pagedProductLines.map(line => (
                <ProductLineRow key={line.id}>
                  <Cell>{line.code}</Cell>
                  <Cell>{line.name}</Cell>
                  <Cell>{line.description || 'N/A'}</Cell>
                  <Cell>{line.products_count || 0}</Cell>
                  <Cell>{String(line.updated_at || '').replace('T', ' ').slice(0, 16) || 'N/A'}</Cell>
                  <Cell>
                    <Actions>
                      <ActionButton type="button" onClick={() => history.push(`/product-lines/${line.id}?${listQuery}`)}>VIEW</ActionButton>
                      <span>|</span>
                      <ActionButton type="button" onClick={() => handleOpenDeleteProductLine(line)}>DELETE</ActionButton>
                    </Actions>
                  </Cell>
                </ProductLineRow>
              ))}
            </Table>
            {!loading && filteredProductLines.length > 0 && (
              <PaginationBar>
                <Meta>Page {safeProductLinesPage} / {productLinesTotalPages}</Meta>
                <PaginationButton type="button" onClick={() => setProductLinesPage((prev) => Math.max(1, prev - 1))} disabled={safeProductLinesPage <= 1}>
                  Prev
                </PaginationButton>
                <PaginationButton type="button" onClick={() => setProductLinesPage((prev) => Math.min(productLinesTotalPages, prev + 1))} disabled={safeProductLinesPage >= productLinesTotalPages}>
                  Next
                </PaginationButton>
              </PaginationBar>
            )}
          </TabPanel>
        )}

        {activeTab === 'variants' && (
          <TabPanel id="product-variants-panel" role="tabpanel" aria-labelledby="product-variants-tab">
            <Toolbar>
              <ListFiltersRow
                searchValue={variantSearch}
                onSearchChange={setVariantSearch}
                searchPlaceholder="Search product variants"
                filters={[
                  {
                    key: 'variants-line',
                    value: variantsLineFilter,
                    onChange: setVariantsLineFilter,
                    options: [
                      { value: 'all', label: 'All Product Lines' },
                      ...productLineFilterOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
                    ],
                  },
                  {
                    key: 'variants-product',
                    value: variantsProductFilter,
                    onChange: setVariantsProductFilter,
                    options: [
                      { value: 'all', label: 'All Products' },
                      ...productNameOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
                    ],
                  },
                ]}
              />
              <div />
            </Toolbar>

            <Table>
              <ProductVariantHeader>
                <div>Variant SKU</div>
                <div>QR Code</div>
                <div>Product</div>
                <div>Variant Name</div>
                <div>Yield</div>
                <div>Actions</div>
              </ProductVariantHeader>

              {loading && <Meta>Loading variants...</Meta>}
              {!loading && pagedVariants.map(item => (
                <ProductVariantRow key={item.id}>
                  <Cell>{item.sku || item.id}</Cell>
                  <Cell>{item.qr_code || 'N/A'}</Cell>
                  <Cell>{productNameById[item.product_id] || item.product_id}</Cell>
                  <Cell>{item.name || 'N/A'}</Cell>
                  <Cell>{Number(item.yield_units || 1)}</Cell>
                  <Cell>
                    <Actions>
                      <ActionButton type="button" onClick={() => history.push(`/products/variants/${item.id}?${listQuery}`)}>VIEW</ActionButton>
                    </Actions>
                  </Cell>
                </ProductVariantRow>
              ))}
            </Table>
            {!loading && filteredVariants.length > 0 && (
              <PaginationBar>
                <Meta>Page {safeVariantsPage} / {variantsTotalPages}</Meta>
                <PaginationButton type="button" onClick={() => setVariantsPage((prev) => Math.max(1, prev - 1))} disabled={safeVariantsPage <= 1}>
                  Prev
                </PaginationButton>
                <PaginationButton type="button" onClick={() => setVariantsPage((prev) => Math.min(variantsTotalPages, prev + 1))} disabled={safeVariantsPage >= variantsTotalPages}>
                  Next
                </PaginationButton>
              </PaginationBar>
            )}
          </TabPanel>
        )}

        {error && <TabPanel><Meta>{error}</Meta></TabPanel>}
      </Surface>

      <AddProductModal
        open={showProductModal}
        skuPreview={skuPreview}
        name={name}
        productLine={productLineId}
        ip={ip}
        category={category}
        listPrice={listPrice}
        designSource={designSource}
        customDesignSource={customDesignSource}
        thirdPartySourceUrl={thirdPartySourceUrl}
        localWorkingFiles={localWorkingFiles}
        imageUrl={imageUrl}
        categoryOptions={PRICING_TIER_OPTIONS}
        designSourceOptions={designSourceOptions}
        productLineOptions={productLineOptions}
        formError={formError}
        onChangeName={setName}
        onChangeProductLine={setProductLineId}
        onChangeIp={setIp}
        onChangeCategory={handleChangeTier}
        onChangeListPrice={setListPrice}
        onChangeDesignSource={setDesignSource}
        onChangeCustomDesignSource={setCustomDesignSource}
        onChangeThirdPartySourceUrl={setThirdPartySourceUrl}
        onChangeLocalWorkingFiles={setLocalWorkingFiles}
        onChangeImageUrl={setImageUrl}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleCreateProduct}
      />

      <AddProductLineModal
        open={showProductLineModal}
        onClose={() => setShowProductLineModal(false)}
        onSubmit={createProductLine}
      />

      <ConfirmActionModal
        open={showDeleteProductModal}
        title="Delete Product"
        description={`You are deleting product: ${productPendingDelete ? productPendingDelete.name : ''}`}
        helperText="This action cannot be undone."
        helperVariant="danger"
        requiredText={productPendingDelete ? (productPendingDelete.product_code || productPendingDelete.id) : ''}
        requiredTextLabel="Type code to confirm"
        inputPlaceholder="Enter product code"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => {
          setShowDeleteProductModal(false)
          setProductPendingDelete(null)
        }}
        onConfirm={() => {
          if (!productPendingDelete) return Promise.resolve()
          return handleDeleteProduct(productPendingDelete)
        }}
      />

      <NoticeModal
        open={showDeleteProductBlockedModal}
        title="Cannot Delete Product"
        message="This product has associated variants. Remove variants first before deleting the product."
        acknowledgeLabel="Understood"
        onClose={() => setShowDeleteProductBlockedModal(false)}
      />

      <ConfirmActionModal
        open={showDeleteProductLineModal}
        title="Delete Product Line"
        description={`You are deleting product line: ${productLinePendingDelete ? productLinePendingDelete.name : ''}`}
        helperText="This action cannot be undone."
        helperVariant="danger"
        requiredText={productLinePendingDelete ? productLinePendingDelete.code : ''}
        requiredTextLabel="Type code to confirm"
        inputPlaceholder="Enter product line code"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => {
          setShowDeleteProductLineModal(false)
          setProductLinePendingDelete(null)
        }}
        onConfirm={() => {
          if (!productLinePendingDelete) return Promise.resolve()
          return handleDeleteProductLine(productLinePendingDelete)
        }}
      />

      <NoticeModal
        open={showDeleteBlockedModal}
        title="Cannot Delete Product Line"
        message="This product line has products associated to it. Remove or reassign related products first."
        acknowledgeLabel="Understood"
        onClose={() => setShowDeleteBlockedModal(false)}
      />
    </PageContent>
  )
}

ProductListPage.propTypes = productListPagePropTypes
ProductListPage.defaultProps = productListPageDefaultProps

export default ProductListPage
