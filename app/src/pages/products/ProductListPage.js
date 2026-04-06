import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import NoticeModal from 'components/reusable/modals/NoticeModal'
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

const TabBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0;
  border-bottom: 1px solid #d6dde6;
  background: #eef2f7;
  padding: 0 14px;
`

const TabButton = styled.button`
  border: 0;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#25384c' : 'transparent')};
  background: transparent;
  color: ${({ $active }) => ($active ? '#25384c' : '#5c6f84')};
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  letter-spacing: 0.02em;
  height: 46px;
  padding: 0 14px;
  cursor: pointer;
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

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  min-width: 280px;
  background: #f0f3f6;
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
  grid-template-columns: 1fr 1.2fr 1.5fr 1fr 1fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.5fr 1fr 1fr 0.7fr;
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

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 14px;
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

const ProductListPage = ({ title }) => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('products')
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
  const [listPrice, setListPrice] = useState('')
  const [designSource, setDesignSource] = useState('')
  const [customDesignSource, setCustomDesignSource] = useState('')
  const [thirdPartySourceUrl, setThirdPartySourceUrl] = useState('')
  const [localWorkingFiles, setLocalWorkingFiles] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [productLineSearch, setProductLineSearch] = useState('')

  const {
    products,
    loading,
    error,
    search,
    setSearch,
    createProduct,
    deleteProduct,
    productLines,
    createProductLine,
    deleteProductLine,
  } = useProductsList()

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
        category: category.trim() || null,
        list_price: Number(listPrice || 0),
        design_source: resolvedDesignSource || null,
        third_party_source_url: thirdPartySourceUrl.trim() || null,
        local_working_files: splitMultiline(localWorkingFiles),
        image_url: imageUrl.trim() || null,
      })
      setName('')
      setProductLineId('')
      setCategory('')
      setListPrice('')
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
    if (defaultPrice !== null) {
      setListPrice(String(defaultPrice))
    }
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

  const breadcrumbItems = activeTab === 'products'
    ? [{ label: 'Inventory', to: '/inventory' }, { label: title }]
    : [{ label: 'Inventory', to: '/inventory' }, { label: title, to: '/products' }, { label: 'Product Lines' }]

  return (
    <PageContent title={<BreadcrumbTitle items={breadcrumbItems} />}>
      <Surface>
        <TabBar role="tablist" aria-label="Product workspace tabs">
          <TabButton
            id="products-tab"
            role="tab"
            aria-selected={activeTab === 'products'}
            aria-controls="products-panel"
            $active={activeTab === 'products'}
            type="button"
            onClick={() => setActiveTab('products')}
          >
            Products
          </TabButton>
          <TabButton
            id="product-lines-tab"
            role="tab"
            aria-selected={activeTab === 'product-lines'}
            aria-controls="product-lines-panel"
            $active={activeTab === 'product-lines'}
            type="button"
            onClick={() => setActiveTab('product-lines')}
          >
            Product Lines
          </TabButton>
        </TabBar>

        {activeTab === 'products' && (
          <TabPanel id="products-panel" role="tabpanel" aria-labelledby="products-tab">
            <Toolbar>
              <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" />
              <div>
                <Button $primary type="button" onClick={() => setShowProductModal(true)}>Add Product</Button>
              </div>
            </Toolbar>

            <Table>
              <ProductHeader>
                <div>Product ID</div>
                <div>Product Line</div>
                <div>Name</div>
                <div>Pricing Tier</div>
                <div>List Price</div>
                <div>Actions</div>
              </ProductHeader>

              {loading && <Meta>Loading products...</Meta>}
              {!loading && products.map(item => (
                <ProductRow key={item.id}>
                  <Cell>{item.product_code || item.sku || item.id}</Cell>
                  <Cell>{item.product_line || 'N/A'}</Cell>
                  <Cell>{item.name}</Cell>
                  <Cell>{displayLabelForTier(item.category)}</Cell>
                  <Cell>{money(item.list_price)}</Cell>
                  <Cell>
                    <Actions>
                      <ActionButton type="button" onClick={() => history.push(`/products/${item.id}`)}>VIEW</ActionButton>
                      <span>|</span>
                      <ActionButton type="button" onClick={() => handleOpenDeleteProduct(item)}>DELETE</ActionButton>
                    </Actions>
                  </Cell>
                </ProductRow>
              ))}
            </Table>
          </TabPanel>
        )}

        {activeTab === 'product-lines' && (
          <TabPanel id="product-lines-panel" role="tabpanel" aria-labelledby="product-lines-tab">
            <Toolbar>
              <Input value={productLineSearch} onChange={event => setProductLineSearch(event.target.value)} placeholder="Search product lines" />
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
              {!loading && filteredProductLines.map(line => (
                <ProductLineRow key={line.id}>
                  <Cell>{line.code}</Cell>
                  <Cell>{line.name}</Cell>
                  <Cell>{line.description || 'N/A'}</Cell>
                  <Cell>{line.products_count || 0}</Cell>
                  <Cell>{String(line.updated_at || '').replace('T', ' ').slice(0, 16) || 'N/A'}</Cell>
                  <Cell>
                    <Actions>
                      <ActionButton type="button" onClick={() => history.push(`/product-lines/${line.id}`)}>VIEW</ActionButton>
                      <span>|</span>
                      <ActionButton type="button" onClick={() => handleOpenDeleteProductLine(line)}>DELETE</ActionButton>
                    </Actions>
                  </Cell>
                </ProductLineRow>
              ))}
            </Table>
          </TabPanel>
        )}

        {error && <TabPanel><Meta>{error}</Meta></TabPanel>}
      </Surface>

      <AddProductModal
        open={showProductModal}
        skuPreview={skuPreview}
        name={name}
        productLine={productLineId}
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
