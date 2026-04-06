import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import NoticeModal from 'components/reusable/modals/NoticeModal'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import GraphWithTableSection from 'components/reusable/analytics/GraphWithTableSection'
import AddProductModal from 'pages/products/modals/AddProductModal'
import { buildProductLineInsightsSectionConfig } from 'pages/products/sections/productLineInsightsSectionConfig'
import { PRICING_TIER_OPTIONS, defaultPriceForTier, displayLabelForTier } from 'pages/products/constants/pricingTiers'
import {
  CUSTOM_DESIGN_SOURCE_VALUE,
  DESIGN_SOURCE_OPTIONS,
} from 'pages/products/constants/designSources'
import { useProductsList } from 'hooks/products/useProductsApi'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
  width: 100%;
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

const ProductLineDetailPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const {
    productLines,
    products,
    loading,
    error,
    createProduct,
    updateProductLine,
    deleteProductLine,
  } = useProductsList()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editError, setEditError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteBlocked, setShowDeleteBlocked] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('')
  const [newProductListPrice, setNewProductListPrice] = useState('')
  const [newProductDesignSource, setNewProductDesignSource] = useState('')
  const [newProductCustomDesignSource, setNewProductCustomDesignSource] = useState('')
  const [newProductThirdPartySourceUrl, setNewProductThirdPartySourceUrl] = useState('')
  const [newProductLocalWorkingFiles, setNewProductLocalWorkingFiles] = useState('')
  const [newProductImageUrl, setNewProductImageUrl] = useState('')
  const [newProductError, setNewProductError] = useState('')

  const productLine = useMemo(
    () => productLines.find(item => item.id === id || item.code === id) || null,
    [productLines, id],
  )

  const productLineRecordId = (productLine && productLine.id) || id

  const relatedProducts = useMemo(
    () => products.filter(product => product.product_line_id === productLineRecordId),
    [products, productLineRecordId],
  )

  useEffect(() => {
    if (!productLine) return
    setEditName(productLine.name || '')
    setEditDescription(productLine.description || '')
  }, [productLine])

  useEffect(() => {
    if (!showAddProductModal) {
      setNewProductError('')
      return
    }
    setNewProductError('')
  }, [showAddProductModal])

  const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))

  const relatedProductRows = useMemo(
    () => relatedProducts.map(product => ({
      key: product.id,
      product_id: product.product_code || product.sku || product.id,
      name: product.name || 'N/A',
      category: displayLabelForTier(product.category),
      list_price: money(product.list_price),
      actions: (
        <ActionButton type="button" onClick={() => history.push(`/products/${product.id}`)}>
          VIEW
        </ActionButton>
      ),
    })),
    [relatedProducts, history],
  )

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Inventory', to: '/inventory' },
      { label: 'Products', to: '/products' },
      { label: 'Product Lines', to: '/products' },
      { label: 'Product Line Detail' },
    ]}
    />
  )

  const saveEdits = async () => {
    setEditError('')
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    try {
      await updateProductLine(productLineRecordId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
        active: productLine ? productLine.active : true,
      })
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || 'Failed to update product line.')
    }
  }

  const onDelete = async () => {
    try {
      await deleteProductLine(productLineRecordId)
      history.push('/products')
    } catch (err) {
      const message = String(err && err.message ? err.message : '')
      if (message.includes('409')) {
        setShowDeleteConfirm(false)
        setShowDeleteBlocked(true)
        return
      }
      setEditError(err.message || 'Failed to delete product line.')
    }
  }

  const showInsightsSection = true

  const insightsConfig = useMemo(
    () => buildProductLineInsightsSectionConfig(relatedProducts),
    [relatedProducts],
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

  const linePrefix = (productLineValue) => {
    const cleaned = String(productLineValue || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (!cleaned) return 'GEN'
    return cleaned.slice(0, 3)
  }

  const skuPreview = useMemo(() => {
    const lineCodeOrName = (productLine && (productLine.code || productLine.name)) || ''
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
  }, [productLine, products])

  const handleCreateAssociatedProduct = async () => {
    setNewProductError('')
    if (!newProductName.trim()) {
      setNewProductError('Product Name is required.')
      return
    }
    if (newProductDesignSource === CUSTOM_DESIGN_SOURCE_VALUE && !newProductCustomDesignSource.trim()) {
      setNewProductError('Custom Design Source is required when Custom is selected.')
      return
    }
    try {
      const resolvedDesignSource = newProductDesignSource === CUSTOM_DESIGN_SOURCE_VALUE
        ? newProductCustomDesignSource.trim()
        : newProductDesignSource.trim()
      await createProduct({
        name: newProductName.trim(),
        product_line_id: productLineRecordId,
        category: newProductCategory.trim() || null,
        list_price: Number(newProductListPrice || 0),
        design_source: resolvedDesignSource || null,
        third_party_source_url: newProductThirdPartySourceUrl.trim() || null,
        local_working_files: String(newProductLocalWorkingFiles || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        image_url: newProductImageUrl.trim() || null,
      })
      setNewProductName('')
      setNewProductCategory('')
      setNewProductListPrice('')
      setNewProductDesignSource('')
      setNewProductCustomDesignSource('')
      setNewProductThirdPartySourceUrl('')
      setNewProductLocalWorkingFiles('')
      setNewProductImageUrl('')
      setShowAddProductModal(false)
    } catch (err) {
      setNewProductError(err.message || 'Failed to create product.')
    }
  }

  const handleChangeAssociatedProductTier = (tier) => {
    setNewProductCategory(tier)
    const defaultPrice = defaultPriceForTier(tier)
    if (defaultPrice !== null) {
      setNewProductListPrice(String(defaultPrice))
    }
  }

  return (
    <PageContent title={breadcrumbTitle}>
      <PageActions>
        {!isEditing && <PrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PrimaryButton>}
        {isEditing && <PrimaryButton type="button" onClick={saveEdits}>SAVE</PrimaryButton>}
        {isEditing && <SecondaryButton type="button" onClick={() => {
          setIsEditing(false)
          setEditError('')
          setEditName((productLine && productLine.name) || '')
          setEditDescription((productLine && productLine.description) || '')
        }}
        >CANCEL</SecondaryButton>}
        <SecondaryButton type="button" onClick={() => setShowDeleteConfirm(true)}>DELETE</SecondaryButton>
      </PageActions>

      <Section>
        <SectionTitle>Product Line Details</SectionTitle>
        <Grid>
          <div>
            <Label>Code</Label>
            <Value>{(productLine && productLine.code) || 'N/A'}</Value>
          </div>
          <div>
            <Label>Name</Label>
            {!isEditing && <Value>{(productLine && productLine.name) || 'N/A'}</Value>}
            {isEditing && (
              <Input
                value={editName}
                onChange={event => setEditName(event.target.value)}
                placeholder="Product line name"
              />
            )}
          </div>
        </Grid>
        <DescriptionBlock>
          <Label>Description</Label>
          {!isEditing && <DescriptionValue>{(productLine && productLine.description) || 'N/A'}</DescriptionValue>}
          {isEditing && (
            <Textarea
              value={editDescription}
              onChange={event => setEditDescription(event.target.value)}
              placeholder="Description"
            />
          )}
        </DescriptionBlock>
        {editError && <DescriptionValue>{editError}</DescriptionValue>}
      </Section>
      <RelatedObjectsTableSection
        title="Associated Products"
        actions={(
          <PrimaryButton type="button" onClick={() => setShowAddProductModal(true)}>
            Add Product
          </PrimaryButton>
        )}
        columns={[
          { key: 'product_id', label: 'Product ID', width: '1.1fr' },
          { key: 'name', label: 'Name', width: '1.5fr' },
          { key: 'category', label: 'Pricing Tier', width: '1fr' },
          { key: 'list_price', label: 'List Price', width: '1fr' },
          { key: 'actions', label: 'Actions', width: '0.7fr' },
        ]}
        rows={relatedProductRows}
        loadingText={loading ? 'Loading associated products...' : ''}
        emptyText={error ? error : 'No products are associated with this product line.'}
      />

      {showInsightsSection && (
        <GraphWithTableSection
          title={insightsConfig.title}
          subtitle={insightsConfig.subtitle}
          series={insightsConfig.series}
          columns={insightsConfig.columns}
          rows={insightsConfig.rows}
          emptyChartText={insightsConfig.emptyChartText}
          emptyTableText={insightsConfig.emptyTableText}
        />
      )}

      <AddProductModal
        open={showAddProductModal}
        skuPreview={skuPreview}
        name={newProductName}
        productLine={productLineRecordId || ''}
        category={newProductCategory}
        listPrice={newProductListPrice}
        designSource={newProductDesignSource}
        customDesignSource={newProductCustomDesignSource}
        thirdPartySourceUrl={newProductThirdPartySourceUrl}
        localWorkingFiles={newProductLocalWorkingFiles}
        imageUrl={newProductImageUrl}
        categoryOptions={PRICING_TIER_OPTIONS}
        designSourceOptions={designSourceOptions}
        productLineOptions={[{
          value: productLineRecordId || '',
          label: productLine ? `${productLine.name} (${productLine.code})` : 'Current Product Line',
        }]}
        formError={newProductError}
        onChangeName={setNewProductName}
        onChangeProductLine={() => {}}
        onChangeCategory={handleChangeAssociatedProductTier}
        onChangeListPrice={setNewProductListPrice}
        onChangeDesignSource={setNewProductDesignSource}
        onChangeCustomDesignSource={setNewProductCustomDesignSource}
        onChangeThirdPartySourceUrl={setNewProductThirdPartySourceUrl}
        onChangeLocalWorkingFiles={setNewProductLocalWorkingFiles}
        onChangeImageUrl={setNewProductImageUrl}
        onClose={() => setShowAddProductModal(false)}
        onSubmit={handleCreateAssociatedProduct}
        lockProductLine
      />

      <ConfirmActionModal
        open={showDeleteConfirm}
        title="Delete Product Line"
        description={`You are deleting product line: ${(productLine && productLine.name) || ''}`}
        helperText="This action cannot be undone."
        helperVariant="danger"
        requiredText={(productLine && productLine.code) || ''}
        requiredTextLabel="Type code to confirm"
        inputPlaceholder="Enter product line code"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDelete}
      />

      <NoticeModal
        open={showDeleteBlocked}
        title="Cannot Delete Product Line"
        message="This product line has products associated to it. Remove or reassign related products first."
        acknowledgeLabel="Understood"
        onClose={() => setShowDeleteBlocked(false)}
      />
    </PageContent>
  )
}

export default ProductLineDetailPage
