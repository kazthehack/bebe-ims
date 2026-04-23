import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import GraphWithTableSection from 'components/reusable/analytics/GraphWithTableSection'
import CapacityBar from 'components/reusable/analytics/CapacityBar'
import QuantityAdjustControl from 'components/reusable/controls/QuantityAdjustControl'
import { useProductDetail, useProductsList } from 'hooks/products/useProductsApi'
import { useListPageScope } from 'contexts/ListPageContext'
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
  PRODUCTS_LIST_CONTEXT_SCOPE,
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

const ErrorText = styled.div`
  margin-top: 8px;
  color: #b42318;
  font-size: 12px;
`

const CapacityCellWrap = styled.div`
  display: grid;
  gap: 4px;
`

const CapacityTopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 6px;
`

const CapacityText = styled.div`
  font-size: 11px;
  color: #41576d;
  line-height: 1.35;
  display: grid;
  gap: 4px;
`

const MiniMetricRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: 6px;
`

const MiniMetricLabel = styled.span`
  color: #4f6278;
`

const MiniMetricValue = styled.span`
  font-weight: 700;
  color: #243648;
`


const ModalMeta = styled.div`
  margin-top: 6px;
  color: #4b6176;
  font-size: 13px;
`

const ModalField = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 10px;
  color: #4b6176;
  font-size: 12px;
`

const ModalTextarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 88px;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const alpha = (value) => String(value || '').trim().toLowerCase()
const DEFAULT_THRESHOLD_PER_SITE = 8
const NO_IP_VALUE = '__no_ip__'
const FSN_OPTIONS = [
  { value: 'fast', label: 'Fast' },
  { value: 'normal', label: 'Normal' },
  { value: 'slow', label: 'Slow' },
  { value: 'non_moving', label: 'Non-Moving' },
]
const parseMultiFilter = (rawValue) => {
  if (rawValue == null || rawValue === 'all') return null
  if (String(rawValue) === '__none__') return []
  const parsed = String(rawValue)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return parsed.length ? parsed : null
}

const ProductDetailPage = () => {
  const location = useLocation()
  const history = useHistory()
  const { id } = useParams()
  const { scopeState } = useListPageScope(PRODUCTS_LIST_CONTEXT_SCOPE)
  const listContext = useMemo(() => ({
    ...scopeState,
    ...readProductsListStateFromSearch(location.search),
  }), [scopeState, location.search])
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
    productsFsnFilter: String(listContext.productsFsnFilter || 'fast,normal,slow'),
    variantsLineFilter: String(listContext.variantsLineFilter || 'all'),
    variantsProductFilter: String(listContext.variantsProductFilter || 'all'),
  }), [listContext])
  const { allProducts } = useProductsList()
  const {
    productDetail,
    inventoryByVariantId,
    inventoryMetricsByVariantId,
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
  const [editFsn, setEditFsn] = useState('normal')
  const [editIp, setEditIp] = useState('')
  const [editListPrice, setEditListPrice] = useState('')
  const [editCapacityThresholdPerSite, setEditCapacityThresholdPerSite] = useState(String(DEFAULT_THRESHOLD_PER_SITE))
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
  const [showQuickLossModal, setShowQuickLossModal] = useState(false)
  const [quickLossVariantId, setQuickLossVariantId] = useState('')
  const [quickLossReason, setQuickLossReason] = useState('')
  const [quickLossError, setQuickLossError] = useState('')
  const [quickLossSubmitting, setQuickLossSubmitting] = useState(false)
  const product = productDetail ? productDetail.product : null
  const capacityThresholdPerSite = Math.max(1, Number((product && product.capacity_threshold_per_site) || DEFAULT_THRESHOLD_PER_SITE))
  const capacityTarget = capacityThresholdPerSite * 4

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
        const lineFilters = parseMultiFilter(String(listContext.productsLineFilter || 'all'))
        const ipFilters = parseMultiFilter(String(listContext.productsIpFilter || 'all'))
        const fsnFilter = String(listContext.productsFsnFilter || 'fast,normal,slow')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
        const query = String(listContext.productsSearch || '').trim().toLowerCase()
        if (lineFilters && !lineFilters.includes(String(item.product_line || ''))) return false
        const normalizedIp = String(item.ip || '').trim() || NO_IP_VALUE
        if (ipFilters && !ipFilters.includes(normalizedIp)) return false
        if (fsnFilter.length && !fsnFilter.includes(String(item.fsn || 'normal'))) return false
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
    [allProducts, listContext.productsLineFilter, listContext.productsIpFilter, listContext.productsFsnFilter, listContext.productsSearch],
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
    setEditFsn(product.fsn || 'normal')
    setEditListPrice(String(product.list_price || 0))
    setEditCapacityThresholdPerSite(String(Math.max(1, Number(product.capacity_threshold_per_site || DEFAULT_THRESHOLD_PER_SITE))))
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
      qr_code: variant.qr_code || 'N/A',
      name: variant.name || 'N/A',
      actions: (
        <ActionButton type="button" onClick={() => history.push(`/products/variants/${variant.id}?${listQuery}`)}>
          VIEW
        </ActionButton>
      ),
    })),
    [variants, history, listQuery],
  )

  const resolveQuickQty = (variantId) => {
    const rawValue = quickQtyByVariant[variantId]
    const parsedQty = Number.parseFloat(rawValue === '' || rawValue === undefined ? '1' : String(rawValue))
    return Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1
  }

  const handleQuickAdd = async (variantId) => {
    setQuickInventoryError('')
    const qty = resolveQuickQty(variantId)
    try {
      setQuickBusyByVariant((prev) => ({ ...prev, [variantId]: true }))
      setQuickQtyByVariant((prev) => ({ ...prev, [variantId]: String(qty) }))
      await adjustVariantGlobalStock({
        variantId,
        qtyDelta: qty,
      })
      setQuickQtyByVariant((prev) => ({ ...prev, [variantId]: '1' }))
    } catch (err) {
      setQuickInventoryError(err.message || 'Failed to add global stock.')
    } finally {
      setQuickBusyByVariant((prev) => ({ ...prev, [variantId]: false }))
    }
  }

  const openQuickLossModal = (variantId) => {
    const qty = resolveQuickQty(variantId)
    setQuickQtyByVariant((prev) => ({ ...prev, [variantId]: String(qty) }))
    setQuickLossVariantId(variantId)
    setQuickLossReason('')
    setQuickLossError('')
    setShowQuickLossModal(true)
  }

  const submitQuickLoss = async () => {
    if (!quickLossVariantId) return
    const qty = resolveQuickQty(quickLossVariantId)
    if (!String(quickLossReason || '').trim()) {
      setQuickLossError('Reason is required.')
      return
    }
    try {
      setQuickLossSubmitting(true)
      setQuickLossError('')
      await adjustVariantGlobalStock({
        variantId: quickLossVariantId,
        qtyDelta: -qty,
        notes: `Loss adjustment: ${String(quickLossReason).trim()}`,
      })
      setQuickQtyByVariant((prev) => ({ ...prev, [quickLossVariantId]: '1' }))
      setShowQuickLossModal(false)
      setQuickLossVariantId('')
      setQuickLossReason('')
    } catch (err) {
      setQuickLossError(err.message || 'Failed to record loss adjustment.')
    } finally {
      setQuickLossSubmitting(false)
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
        fsn: ((FSN_OPTIONS.find((option) => option.value === String(variant.fsn || 'normal')) || {}).label) || 'Normal',
        capacity: (
          <CapacityCellWrap>
            <CapacityTopRow>
              <CapacityBar
                value={Number((inventoryMetricsByVariantId[variant.id] || {}).global_qty || 0)}
                target={capacityTarget}
                textPosition="right"
              />
            </CapacityTopRow>
            <CapacityText>
              <MiniMetricRow>
                <MiniMetricLabel>Storage</MiniMetricLabel>
                <CapacityBar
                  value={Number((inventoryMetricsByVariantId[variant.id] || {}).storage_qty || 0)}
                  target={capacityThresholdPerSite}
                  height={6}
                  textPosition="none"
                />
                <MiniMetricValue>{Number((inventoryMetricsByVariantId[variant.id] || {}).storage_qty || 0)} / {capacityThresholdPerSite}</MiniMetricValue>
              </MiniMetricRow>
              <MiniMetricRow>
                <MiniMetricLabel>Site 1</MiniMetricLabel>
                <CapacityBar
                  value={Number((inventoryMetricsByVariantId[variant.id] || {}).primary_qty || 0)}
                  target={capacityThresholdPerSite}
                  height={6}
                  textPosition="none"
                />
                <MiniMetricValue>{Number((inventoryMetricsByVariantId[variant.id] || {}).primary_qty || 0)} / {capacityThresholdPerSite}</MiniMetricValue>
              </MiniMetricRow>
              <MiniMetricRow>
                <MiniMetricLabel>Site 2</MiniMetricLabel>
                <CapacityBar
                  value={Number((inventoryMetricsByVariantId[variant.id] || {}).secondary_qty || 0)}
                  target={capacityThresholdPerSite}
                  height={6}
                  textPosition="none"
                />
                <MiniMetricValue>{Number((inventoryMetricsByVariantId[variant.id] || {}).secondary_qty || 0)} / {capacityThresholdPerSite}</MiniMetricValue>
              </MiniMetricRow>
              <MiniMetricRow>
                <MiniMetricLabel>Site 3</MiniMetricLabel>
                <CapacityBar
                  value={Number((inventoryMetricsByVariantId[variant.id] || {}).tertiary_qty || 0)}
                  target={capacityThresholdPerSite}
                  height={6}
                  textPosition="none"
                />
                <MiniMetricValue>{Number((inventoryMetricsByVariantId[variant.id] || {}).tertiary_qty || 0)} / {capacityThresholdPerSite}</MiniMetricValue>
              </MiniMetricRow>
            </CapacityText>
          </CapacityCellWrap>
        ),
        adjust: (
          <QuantityAdjustControl
            buttonSize={28}
            inputWidth={58}
            value={value}
            onChange={(nextValue) => {
              setQuickQtyByVariant((prev) => ({ ...prev, [variant.id]: nextValue }))
            }}
            onDecrement={() => openQuickLossModal(variant.id)}
            onIncrement={() => handleQuickAdd(variant.id)}
            disabled={Boolean(quickBusyByVariant[variant.id])}
            filledButtons={false}
            min={1}
            step={1}
            placeholder="1"
          />
        ),
        actions: (
          <ActionButton type="button" onClick={() => history.push(`/inventory/inv-${variant.id}?${listQuery}`)}>
            VIEW
          </ActionButton>
        ),
      }
    }),
    [variants, quickQtyByVariant, quickBusyByVariant, inventoryByVariantId, inventoryMetricsByVariantId, history, capacityTarget, capacityThresholdPerSite],
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
    const parsedCapacityThreshold = Number(editCapacityThresholdPerSite)
    if (!Number.isFinite(parsedCapacityThreshold) || parsedCapacityThreshold < 1) {
      setEditError('Capacity threshold per site must be at least 1.')
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
        fsn: editFsn || 'normal',
        list_price: Number(editListPrice || 0),
        capacity_threshold_per_site: parsedCapacityThreshold,
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
                  setEditFsn((product && product.fsn) || 'normal')
                  setEditListPrice(String((product && product.list_price) || 0))
                  setEditCapacityThresholdPerSite(
                    String(Math.max(1, Number((product && product.capacity_threshold_per_site) || DEFAULT_THRESHOLD_PER_SITE))),
                  )
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
                <Label>FSN</Label>
                {!isEditing && (
                  <Value>
                    {((FSN_OPTIONS.find((option) => option.value === String(product.fsn || 'normal')) || {}).label) || 'Normal'}
                  </Value>
                )}
                {isEditing && (
                  <Select value={editFsn} onChange={event => setEditFsn(event.target.value)}>
                    {FSN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </Select>
                )}
              </div>
              <div>
                <Label>List Price</Label>
                {!isEditing && <Value>{money(product.list_price)}</Value>}
                {isEditing && <Input type="number" min="0" step="0.01" value={editListPrice} onChange={event => setEditListPrice(event.target.value)} placeholder="0.00" />}
              </div>
              <div>
                <Label>Capacity Threshold / Site</Label>
                {!isEditing && <Value>{capacityThresholdPerSite}</Value>}
                {isEditing && (
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={editCapacityThresholdPerSite}
                    onChange={event => setEditCapacityThresholdPerSite(event.target.value)}
                    placeholder="8"
                  />
                )}
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
              { key: 'qr_code', label: 'QR Code', width: '1.6fr' },
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
              { key: 'fsn', label: 'FSN', width: '0.7fr' },
              { key: 'capacity', label: 'Capacity', width: '1fr' },
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

          <FormModal
            open={showQuickLossModal}
            title="Record Loss Adjustment"
            onClose={() => {
              setShowQuickLossModal(false)
              setQuickLossVariantId('')
              setQuickLossReason('')
              setQuickLossError('')
              setQuickLossSubmitting(false)
            }}
            onConfirm={submitQuickLoss}
            confirmLabel={quickLossSubmitting ? 'Saving...' : 'Save'}
            cancelLabel="Cancel"
            confirmDisabled={quickLossSubmitting}
            width="460px"
            actionsAlign="right"
            closeControl="glyph"
          >
            <ModalMeta>
              This will reduce global stock by <strong>{quickLossVariantId ? resolveQuickQty(quickLossVariantId) : 0}</strong>.
            </ModalMeta>
            <ModalField>
              <span>Reason (required)</span>
              <ModalTextarea
                value={quickLossReason}
                onChange={(event) => setQuickLossReason(event.target.value)}
                placeholder="e.g. damaged print, failed batch, lost item"
              />
            </ModalField>
            {quickLossError && <ErrorText>{quickLossError}</ErrorText>}
          </FormModal>

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
