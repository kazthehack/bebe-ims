import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import GraphWithTableSection from 'components/reusable/analytics/GraphWithTableSection'
import { useProductDetail, useProductsList } from 'hooks/products/useProductsApi'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import AddProductVariantModal from './modals/AddProductVariantModal'
import { PRICING_TIER_OPTIONS, displayLabelForTier } from './constants/pricingTiers'
import { buildProductInsightsSectionConfig } from './sections/productInsightsSectionConfig'
import {
  CUSTOM_DESIGN_SOURCE_VALUE,
  DESIGN_SOURCE_OPTIONS,
  displayLabelForDesignSource,
} from './constants/designSources'
import {
  readProductsListState,
  readProductsListStateFromSearch,
  toProductsListQuery,
} from './productsListState'

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const PrimaryButton = styled.button`
  height: 34px;
  border: 1px solid #25384c;
  background: #25384c;
  color: #fff;
  border-radius: 4px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`

const SecondaryButton = styled.button`
  height: 34px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #25384c;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: #243648;
  font-size: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`

const Label = styled.div`
  color: #607589;
  font-size: 12px;
  margin-bottom: 4px;
`

const Value = styled.div`
  color: #243648;
  font-size: 14px;
  font-weight: 600;
  min-height: 38px;
  display: flex;
  align-items: center;
`

const DescriptionBlock = styled.div`
  margin-top: 10px;
`

const DescriptionValue = styled.div`
  color: #243648;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

const Textarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 90px;
  margin: 0;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

const FullWidth = styled.div`
  grid-column: 1 / -1;
`

const StockAdjustControl = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const StockAdjustButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  border-radius: 4px;
  color: #2f4256;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`

const StockAdjustInput = styled.input`
  width: 58px;
  height: 28px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  background: #f0f3f6;
  color: #243648;
  text-align: center;
`

const ErrorText = styled.div`
  margin-top: 8px;
  color: #b42318;
  font-size: 12px;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const alpha = (value) => String(value || '').trim().toLowerCase()

const ProductDetailPage = () => {
  const location = useLocation()
  const history = useHistory()
  const { id } = useParams()
  const listContext = useMemo(() => ({
    ...readProductsListState(),
    ...readProductsListStateFromSearch(location.search),
  }), [location.search])
  const listQuery = useMemo(() => toProductsListQuery({
    activeTab: String(listContext.activeTab || 'products'),
    productsSearch: String(listContext.productsSearch || ''),
    productLineSearch: String(listContext.productLineSearch || ''),
    variantSearch: String(listContext.variantSearch || ''),
    productsPage: Math.max(1, Number(listContext.productsPage || 1)),
    productLinesPage: Math.max(1, Number(listContext.productLinesPage || 1)),
    variantsPage: Math.max(1, Number(listContext.variantsPage || 1)),
    productsLineFilter: String(listContext.productsLineFilter || 'all'),
    productsIpFilter: String(listContext.productsIpFilter || 'all'),
    variantsLineFilter: String(listContext.variantsLineFilter || 'all'),
    variantsProductFilter: String(listContext.variantsProductFilter || 'all'),
  }), [listContext])
  const { allProducts } = useProductsList()
  const {
    productDetail,
    inventoryByVariantId,
    loading,
    error,
    createVariant,
    deleteProduct,
    updateProduct,
    adjustVariantGlobalStock,
  } = useProductDetail(id)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editIp, setEditIp] = useState('')
  const [editListPrice, setEditListPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDesignSource, setEditDesignSource] = useState('')
  const [editCustomDesignSource, setEditCustomDesignSource] = useState('')
  const [editThirdPartySourceUrl, setEditThirdPartySourceUrl] = useState('')
  const [editLocalWorkingFiles, setEditLocalWorkingFiles] = useState('')
  const [editError, setEditError] = useState('')
  const [showAddVariantModal, setShowAddVariantModal] = useState(false)
  const [variantName, setVariantName] = useState('')
  const [variantFormError, setVariantFormError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [quickQtyByVariant, setQuickQtyByVariant] = useState({})
  const [quickBusyByVariant, setQuickBusyByVariant] = useState({})
  const [quickInventoryError, setQuickInventoryError] = useState('')
  const product = productDetail ? productDetail.product : null

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Products', to: `/products?${listQuery}` },
      { label: product ? (product.name || product.product_code || product.id) : 'Product Detail' },
    ]}
    />
  )

  const navigationProducts = useMemo(
    () => (allProducts || [])
      .filter((item) => {
        const lineFilter = String(listContext.productsLineFilter || 'all')
        const ipFilter = String(listContext.productsIpFilter || 'all')
        const query = String(listContext.productsSearch || '').trim().toLowerCase()
        if (lineFilter !== 'all' && String(item.product_line || '') !== lineFilter) return false
        if (ipFilter !== 'all' && String(item.ip || '') !== ipFilter) return false
        if (!query) return true
        return (
          String(item.product_code || '').toLowerCase().includes(query)
          || String(item.name || '').toLowerCase().includes(query)
          || String(item.product_line || '').toLowerCase().includes(query)
          || String(item.ip || '').toLowerCase().includes(query)
          || String(item.category || '').toLowerCase().includes(query)
          || String(item.list_price || '').includes(query)
        )
      })
      .sort((a, b) => {
        const lineCompare = alpha(a.product_line).localeCompare(alpha(b.product_line))
        if (lineCompare !== 0) return lineCompare
        const productCompare = alpha(a.name).localeCompare(alpha(b.name))
        if (productCompare !== 0) return productCompare
        return alpha(a.product_code || a.id).localeCompare(alpha(b.product_code || b.id))
      }),
    [allProducts, listContext.productsLineFilter, listContext.productsIpFilter, listContext.productsSearch],
  )

  const currentProductIndex = useMemo(
    () => navigationProducts.findIndex((item) => String(item.id) === String(id)),
    [navigationProducts, id],
  )
  const previousProduct = currentProductIndex > 0 ? navigationProducts[currentProductIndex - 1] : null
  const nextProduct = (
    currentProductIndex >= 0 && currentProductIndex < navigationProducts.length - 1
      ? navigationProducts[currentProductIndex + 1]
      : null
  )

  const variants = useMemo(() => {
    const source = productDetail ? (productDetail.variants || []) : []
    return [...source].sort((a, b) => {
      const aCreated = Date.parse(String(a.created_at || ''))
      const bCreated = Date.parse(String(b.created_at || ''))
      const aTime = Number.isFinite(aCreated) ? aCreated : Number.POSITIVE_INFINITY
      const bTime = Number.isFinite(bCreated) ? bCreated : Number.POSITIVE_INFINITY
      if (aTime !== bTime) return aTime - bTime
      return String(a.id || '').localeCompare(String(b.id || ''))
    })
  }, [productDetail])

  useEffect(() => {
    if (!product) return
    setEditName(product.name || '')
    setEditIp(product.ip || '')
    setEditCategory(product.category || '')
    setEditListPrice(String(product.list_price || 0))
    setEditDescription(product.description || '')
    const source = String(product.design_source || '')
    const knownSource = DESIGN_SOURCE_OPTIONS.some((option) => option.value === source)
    setEditDesignSource(knownSource ? source : (source ? CUSTOM_DESIGN_SOURCE_VALUE : ''))
    setEditCustomDesignSource(knownSource ? '' : source)
    setEditThirdPartySourceUrl(product.third_party_source_url || '')
    setEditLocalWorkingFiles((product.local_working_files || []).join('\n'))
    setEditError('')
  }, [product])

  const insightsConfig = useMemo(
    () => buildProductInsightsSectionConfig(variants),
    [variants],
  )

  const variantRows = useMemo(
    () => variants.map((variant) => ({
      key: variant.id,
      sku: variant.sku || 'N/A',
      name: variant.name || 'N/A',
      actions: (
        <ActionButton type="button" onClick={() => history.push(`/products/variants/${variant.id}`)}>
          VIEW
        </ActionButton>
      ),
    })),
    [variants, history],
  )

  const handleQuickAdjust = async (variantId, direction) => {
    setQuickInventoryError('')
    const rawValue = quickQtyByVariant[variantId]
    const parsedQty = Number.parseFloat(rawValue === '' || rawValue === undefined ? '1' : String(rawValue))
    const qty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1
    try {
      setQuickBusyByVariant((prev) => ({ ...prev, [variantId]: true }))
      setQuickQtyByVariant((prev) => ({ ...prev, [variantId]: String(qty) }))
      await adjustVariantGlobalStock({
        variantId,
        qtyDelta: direction > 0 ? qty : -qty,
      })
      setQuickQtyByVariant((prev) => ({ ...prev, [variantId]: '1' }))
    } catch (err) {
      setQuickInventoryError(err.message || 'Failed to adjust global stock.')
    } finally {
      setQuickBusyByVariant((prev) => ({ ...prev, [variantId]: false }))
    }
  }

  const quickInventoryRows = useMemo(
    () => variants.map((variant) => {
      const value = Object.prototype.hasOwnProperty.call(quickQtyByVariant, variant.id)
        ? quickQtyByVariant[variant.id]
        : '1'
      return {
        key: `quick-${variant.id}`,
        sku: variant.sku || 'N/A',
        name: variant.name || 'N/A',
        global_stock: Number(inventoryByVariantId[variant.id] || 0),
        adjust: (
          <StockAdjustControl>
            <StockAdjustButton
              type="button"
              disabled={Boolean(quickBusyByVariant[variant.id])}
              onClick={() => handleQuickAdjust(variant.id, -1)}
            >
              -
            </StockAdjustButton>
            <StockAdjustInput
              type="number"
              min="1"
              step="1"
              value={value}
              onChange={(event) => {
                const nextValue = event.target.value
                setQuickQtyByVariant((prev) => ({ ...prev, [variant.id]: nextValue }))
              }}
            />
            <StockAdjustButton
              type="button"
              disabled={Boolean(quickBusyByVariant[variant.id])}
              onClick={() => handleQuickAdjust(variant.id, 1)}
            >
              +
            </StockAdjustButton>
          </StockAdjustControl>
        ),
        actions: (
          <ActionButton type="button" onClick={() => history.push(`/inventory/inv-${variant.id}`)}>
            VIEW
          </ActionButton>
        ),
      }
    }),
    [variants, quickQtyByVariant, quickBusyByVariant, inventoryByVariantId, history],
  )

  const handleCreateVariant = async () => {
    setVariantFormError('')
    try {
      await createVariant({
        name: variantName.trim() || null,
        image_url: null,
      })
      setVariantName('')
      setShowAddVariantModal(false)
    } catch (err) {
      setVariantFormError(err.message || 'Failed to create variant.')
    }
  }

  const handleDeleteProduct = async () => {
    setDeleteError('')
    try {
      await deleteProduct()
      history.push(`/products?${listQuery}`)
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete product.')
    }
  }

  const handleSaveProduct = async () => {
    if (!product) return
    setEditError('')
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    if (editDesignSource === CUSTOM_DESIGN_SOURCE_VALUE && !editCustomDesignSource.trim()) {
      setEditError('Custom Design Source is required when Custom is selected.')
      return
    }
    try {
      await updateProduct({
        name: editName.trim(),
        product_line_id: product.product_line_id,
        ip: editIp.trim() || null,
        category: editCategory || null,
        list_price: Number(editListPrice || 0),
        description: editDescription.trim() || null,
        design_source: (
          editDesignSource === CUSTOM_DESIGN_SOURCE_VALUE
            ? editCustomDesignSource.trim()
            : editDesignSource.trim()
        ) || null,
        third_party_source_url: editThirdPartySourceUrl.trim() || null,
        local_working_files: String(editLocalWorkingFiles || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        image_url: product.image_url || null,
      })
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || 'Failed to update product.')
    }
  }

  return (
    <PageContent title={breadcrumbTitle}>
      {loading && <Section>Loading product details...</Section>}
      {!loading && error && <Section>{error}</Section>}
      {!loading && productDetail && product && (
        <>
          <PageActions>
            <SecondaryButton
              type="button"
              disabled={!previousProduct}
              onClick={() => previousProduct && history.push(`/products/${previousProduct.id}?${listQuery}`)}
            >
              {'<'}
            </SecondaryButton>
            <SecondaryButton
              type="button"
              disabled={!nextProduct}
              onClick={() => nextProduct && history.push(`/products/${nextProduct.id}?${listQuery}`)}
            >
              {'>'}
            </SecondaryButton>
            {!isEditing && <PrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PrimaryButton>}
            {isEditing && <PrimaryButton type="button" onClick={handleSaveProduct}>SAVE</PrimaryButton>}
            {isEditing && (
              <SecondaryButton
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditError('')
                  setEditName((product && product.name) || '')
                  setEditIp((product && product.ip) || '')
                  setEditCategory((product && product.category) || '')
                  setEditListPrice(String((product && product.list_price) || 0))
                  setEditDescription((product && product.description) || '')
                  const source = String((product && product.design_source) || '')
                  const knownSource = DESIGN_SOURCE_OPTIONS.some((option) => option.value === source)
                  setEditDesignSource(knownSource ? source : (source ? CUSTOM_DESIGN_SOURCE_VALUE : ''))
                  setEditCustomDesignSource(knownSource ? '' : source)
                  setEditThirdPartySourceUrl((product && product.third_party_source_url) || '')
                  setEditLocalWorkingFiles(((product && product.local_working_files) || []).join('\n'))
                }}
              >
                CANCEL
              </SecondaryButton>
            )}
            <SecondaryButton type="button" onClick={() => setShowDeleteConfirm(true)}>DELETE</SecondaryButton>
          </PageActions>
          <Section>
            <SectionTitle>Product Details</SectionTitle>
            <Grid>
              <div>
                <Label>Code</Label>
                <Value>{product.product_code || product.sku || product.id}</Value>
              </div>
              <div>
                <Label>Name</Label>
                {!isEditing && <Value>{product.name || 'N/A'}</Value>}
                {isEditing && <Input value={editName} onChange={event => setEditName(event.target.value)} placeholder="Product name" />}
              </div>
              <div>
                <Label>Product Line</Label>
                <Value>{product.product_line || 'N/A'}</Value>
              </div>
              <div>
                <Label>IP</Label>
                {!isEditing && <Value>{product.ip || 'N/A'}</Value>}
                {isEditing && <Input value={editIp} onChange={event => setEditIp(event.target.value)} placeholder="Minecraft / Pokemon / Super Mario" />}
              </div>
              <div>
                <Label>Pricing Tier</Label>
                {!isEditing && <Value>{displayLabelForTier(product.category)}</Value>}
                {isEditing && (
                  <Select value={editCategory} onChange={event => setEditCategory(event.target.value)}>
                    {PRICING_TIER_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </Select>
                )}
              </div>
              <div>
                <Label>List Price</Label>
                {!isEditing && <Value>{money(product.list_price)}</Value>}
                {isEditing && <Input type="number" min="0" step="0.01" value={editListPrice} onChange={event => setEditListPrice(event.target.value)} placeholder="0.00" />}
              </div>
              <div>
                <Label>Design Source</Label>
                {!isEditing && <Value>{displayLabelForDesignSource(product.design_source)}</Value>}
                {isEditing && (
                  <Select value={editDesignSource} onChange={event => setEditDesignSource(event.target.value)}>
                    <option value="">Select design source</option>
                    {DESIGN_SOURCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    <option value={CUSTOM_DESIGN_SOURCE_VALUE}>Custom...</option>
                  </Select>
                )}
              </div>
              {isEditing && editDesignSource === CUSTOM_DESIGN_SOURCE_VALUE && (
                <div>
                  <Label>Custom Design Source</Label>
                  <Input value={editCustomDesignSource} onChange={event => setEditCustomDesignSource(event.target.value)} placeholder="Designer / source name" />
                </div>
              )}
              <div>
                <Label>3rd-party Source URL</Label>
                {!isEditing && <Value>{product.third_party_source_url || 'N/A'}</Value>}
                {isEditing && <Input value={editThirdPartySourceUrl} onChange={event => setEditThirdPartySourceUrl(event.target.value)} placeholder="https://..." />}
              </div>
              <FullWidth>
                <DescriptionBlock>
                  <Label>Description</Label>
                  {!isEditing && <DescriptionValue>{product.description || 'N/A'}</DescriptionValue>}
                  {isEditing && <Textarea value={editDescription} onChange={event => setEditDescription(event.target.value)} placeholder="Description" />}
                </DescriptionBlock>
              </FullWidth>
              <FullWidth>
                <DescriptionBlock>
                  <Label>Local Working Files (one per line)</Label>
                  {!isEditing && <DescriptionValue>{(product.local_working_files || []).length > 0 ? product.local_working_files.join('\n') : 'N/A'}</DescriptionValue>}
                  {isEditing && <Textarea value={editLocalWorkingFiles} onChange={event => setEditLocalWorkingFiles(event.target.value)} placeholder={'file/path/one.ai\nfile/path/two.psd'} />}
                </DescriptionBlock>
              </FullWidth>
            </Grid>
            {editError && <DescriptionValue>{editError}</DescriptionValue>}
            {deleteError && <DescriptionValue>{deleteError}</DescriptionValue>}
          </Section>

          <RelatedObjectsTableSection
            title="Variants"
            actions={(
              <PrimaryButton type="button" onClick={() => {
                setVariantFormError('')
                setShowAddVariantModal(true)
              }}
              >
                Add Variant
              </PrimaryButton>
            )}
            columns={[
              { key: 'sku', label: 'Variant SKU', width: '1.2fr' },
              { key: 'name', label: 'Name', width: '1.4fr' },
              { key: 'actions', label: 'Actions', width: '0.8fr' },
            ]}
            rows={variantRows}
            loadingText={loading ? 'Loading variants...' : ''}
            emptyText={error ? error : 'No variants yet.'}
          />

          <RelatedObjectsTableSection
            title="Quick Inventory"
            columns={[
              { key: 'sku', label: 'Variant SKU', width: '1.1fr' },
              { key: 'name', label: 'Variant Name', width: '1.4fr' },
              { key: 'global_stock', label: 'Global Stock', width: '0.8fr' },
              { key: 'adjust', label: 'Adjust', width: '1fr' },
              { key: 'actions', label: 'Actions', width: '0.7fr' },
            ]}
            rows={quickInventoryRows}
            loadingText={loading ? 'Loading quick inventory...' : ''}
            emptyText={error ? error : 'No variants yet.'}
          />
          {quickInventoryError && <ErrorText>{quickInventoryError}</ErrorText>}

          <GraphWithTableSection
            title={insightsConfig.title}
            subtitle={insightsConfig.subtitle}
            series={insightsConfig.series}
            columns={insightsConfig.columns}
            rows={insightsConfig.rows}
            emptyChartText={insightsConfig.emptyChartText}
            emptyTableText={insightsConfig.emptyTableText}
          />

          <AddProductVariantModal
            open={showAddVariantModal}
            productOptions={[{
              id: product.id,
              label: `${product.name || 'Product'} (${product.product_code || product.id})`,
            }]}
            variantProductId={product.id}
            variantName={variantName}
            formError={variantFormError}
            onChangeProductId={() => {}}
            onChangeName={setVariantName}
            onClose={() => setShowAddVariantModal(false)}
            onSubmit={handleCreateVariant}
            lockProduct
          />

          <ConfirmActionModal
            open={showDeleteConfirm}
            title="Delete Product"
            description={`You are deleting product: ${product.name || ''}`}
            helperText="This action cannot be undone."
            helperVariant="danger"
            requiredText={product.product_code || product.id}
            requiredTextLabel="Type code to confirm"
            inputPlaceholder="Enter product code"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteProduct}
          />
        </>
      )}
    </PageContent>
  )
}

export default ProductDetailPage
