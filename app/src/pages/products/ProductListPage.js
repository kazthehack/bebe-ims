import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { useProductsList } from 'hooks/products/useProductsApi'

const PageSurface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 14px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const FilterPill = styled.button`
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #51667c;
  border-radius: 4px;
  height: 40px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 8px;
`

const RightTools = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const SearchWrap = styled.div`
  position: relative;
`

const SearchIcon = styled(ProductIcon)`
  position: absolute;
  left: 12px;
  top: 12px;
  color: #4c6075;
  font-size: 15px;
`

const SearchInput = styled.input`
  width: 220px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 40px;
  padding: 0 14px 0 34px;
  font-size: 14px;
  color: #2f3f52;
  background: #f0f3f6;
`

const Button = styled.button`
  height: 40px;
  min-width: 88px;
  border-radius: 4px;
  border: 1px solid ${({ $primary }) => ($primary ? '#2f3f52' : '#bec8d3')};
  background: ${({ $primary }) => ($primary ? '#2f3f52' : '#f0f3f6')};
  color: ${({ $primary }) => ($primary ? '#ffffff' : '#4f6479')};
  font-size: 13px;
  font-weight: 600;
  padding: 0 12px;
  cursor: pointer;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(23, 33, 45, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

const Modal = styled.div`
  width: 460px;
  background: #f8fafc;
  border: 1px solid #d9e2ed;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(18, 31, 45, 0.22);
  padding: 16px;
`

const ModalTitle = styled.h3`
  margin: 0 0 12px;
  color: #243648;
  font-size: 18px;
`

const FormGrid = styled.div`
  display: grid;
  gap: 10px;
`

const Label = styled.label`
  font-size: 12px;
  color: #4c6074;
  font-weight: 600;
`

const Field = styled.input`
  width: 100%;
  border: 1px solid #c3cedb;
  border-radius: 4px;
  background: #ffffff;
  color: #243648;
  height: 38px;
  padding: 0 10px;
  font-size: 14px;
  margin-top: 4px;
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`

const TableShell = styled.div`
  margin-top: 6px;
`

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr 1.2fr 0.9fr 1.1fr 0.7fr;
  color: #4f6278;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 4px 10px 8px;
`

const DataRow = styled.button`
  width: 100%;
  margin: 0 0 6px;
  padding: 0;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  display: grid;
  grid-template-columns: 1fr 1.6fr 1.2fr 0.9fr 1.1fr 0.7fr;
  align-items: center;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #dde4ec;
  }
`

const Cell = styled.div`
  min-height: 54px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  color: #273646;
  font-size: 14px;
`

const NameCell = styled(Cell)`
  font-size: 15px;
  font-weight: 500;
`

const Variants = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const VariantTag = styled.span`
  border: 1px solid #bcc9d8;
  color: #2f4b68;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  background: #f0f4f8;
`

const ActionCell = styled(Cell)`
  justify-content: space-between;
  color: #4f6479;
  font-weight: 600;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Tag = styled.span`
  border: 1px solid #b9c7d6;
  color: #455f79;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  background: #edf2f7;
`

const Meta = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #5e5e5e;
`

const Empty = styled.div`
  padding: 14px;
  font-size: 13px;
  color: #5e5e5e;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const buildTags = (item) => {
  const tags = [item.category || 'General']
  if ((item.variants || []).length > 1) tags.push('Multi-Variant')
  else tags.push('Single Variant')
  return tags
}

const ProductListPage = ({ title }) => {
  const history = useHistory()
  const [addOpen, setAddOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [variantsInput, setVariantsInput] = useState('')
  const {
    products,
    loading,
    error,
    search,
    setSearch,
    importStatus,
    importMockProducts,
    createProduct,
  } = useProductsList()

  const handleCreate = async () => {
    const cleanCategory = category.trim()
    const cleanName = name.trim()
    const variants = variantsInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    if (!cleanCategory || !cleanName) {
      setFormError('Category and Name are required.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      await createProduct({ category: cleanCategory, name: cleanName, variants })
      setCategory('')
      setName('')
      setVariantsInput('')
      setAddOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContent title={title}>
      <PageSurface>
        <Toolbar>
          <FilterGroup>
            <FilterPill>Category <ProductIcon type="dropDown" /></FilterPill>
            <FilterPill>Variant <ProductIcon type="dropDown" /></FilterPill>
            <FilterPill>Date Range <ProductIcon type="dropDown" /></FilterPill>
            <FilterPill>Site <ProductIcon type="dropDown" /></FilterPill>
          </FilterGroup>

          <RightTools>
            <SearchWrap>
              <SearchIcon type="search" />
              <SearchInput
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search"
              />
            </SearchWrap>
            <Button type="button" onClick={importMockProducts}>Import</Button>
            <Button $primary type="button" onClick={() => setAddOpen(true)}>Add</Button>
          </RightTools>
        </Toolbar>

        <TableShell>
          <HeaderRow>
            <div>Category</div>
            <div>Name</div>
            <div>Variants</div>
            <div>Cost</div>
            <div>Tags</div>
            <div>Actions</div>
          </HeaderRow>

          {loading && <Empty>Loading products...</Empty>}
          {!loading && products.length === 0 && <Empty>No products available.</Empty>}
          {!loading && products.map(item => (
            <DataRow key={item.id} type="button" onClick={() => history.push(`/products/${item.id}`)}>
              <Cell>{item.category}</Cell>
              <NameCell>{item.name}</NameCell>
              <Cell>
                <Variants>
                  {(item.variants || []).map(variant => (
                    <VariantTag key={`${item.id}-${variant}`}>{variant}</VariantTag>
                  ))}
                </Variants>
              </Cell>
              <Cell>{money(item.cost_php)}</Cell>
              <Cell>
                <Tags>
                  {buildTags(item).map(tag => (
                    <Tag key={`${item.id}-${tag}`}>{tag}</Tag>
                  ))}
                </Tags>
              </Cell>
              <ActionCell>
                View
                <ProductIcon type="rightArrow" />
              </ActionCell>
            </DataRow>
          ))}
        </TableShell>
      </PageSurface>

      <Meta>Variants are unified per product line item and displayed as tags.</Meta>
      {importStatus && <Meta>{importStatus}</Meta>}
      {error && <Meta>{error}</Meta>}

      {addOpen && (
        <Overlay onClick={() => !saving && setAddOpen(false)}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalTitle>Add Product</ModalTitle>
            <FormGrid>
              <Label>
                Category *
                <Field
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  placeholder="Accessories"
                  disabled={saving}
                />
              </Label>
              <Label>
                Name *
                <Field
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Keychain Delta"
                  disabled={saving}
                />
              </Label>
              <Label>
                Variants (comma-separated)
                <Field
                  value={variantsInput}
                  onChange={event => setVariantsInput(event.target.value)}
                  placeholder="Red, Blue"
                  disabled={saving}
                />
              </Label>
            </FormGrid>
            {formError && <Meta>{formError}</Meta>}
            <ModalActions>
              <Button type="button" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button>
              <Button $primary type="button" onClick={handleCreate} disabled={saving}>
                {saving ? 'Saving...' : 'Create'}
              </Button>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </PageContent>
  )
}

ProductListPage.propTypes = {
  title: PropTypes.string,
}

ProductListPage.defaultProps = {
  title: 'Inventory',
}

export default ProductListPage
