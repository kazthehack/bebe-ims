import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import { useStockResource } from 'hooks/bazaar/useBazaarApi'
import { useProductsList } from 'hooks/products/useProductsApi'
import AddInventoryModal from './modals/AddInventoryModal'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
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
  min-width: 220px;
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

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.6fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.button`
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.6fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
  cursor: pointer;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const InventoryListPage = () => {
  const history = useHistory()
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false)
  const [search, setSearch] = useState('')

  const {
    productStock,
    loading,
    error,
    createProductStock,
  } = useStockResource()
  const { variantsByProductId } = useProductsList()

  const filteredRows = (productStock || []).filter((item) => {
    const q = (search || '').trim().toLowerCase()
    if (!q) return true
    return [
      item.id,
      item.product_variant_id,
      item.site_id,
      item.qty_on_hand,
      item.qty_reserved,
      item.qty_available,
      item.low_stock_threshold,
    ].join(' ').toLowerCase().includes(q)
  })

  return (
    <PageContent title="Inventory">
      <Surface>
        <Toolbar>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by inventory id, variant id, site"
          />
          <div>
            <Button type="button" onClick={() => history.push('/products')}>Add Product</Button>
            <Button $primary type="button" onClick={() => setShowAddInventoryModal(true)} style={{ marginLeft: 8 }}>Add Inventory</Button>
          </div>
        </Toolbar>

        <Table>
          <Header>
            <div>ID</div>
            <div>Product Variant</div>
            <div>Site</div>
            <div>On Hand</div>
            <div>Reserved</div>
            <div>Available</div>
            <div>Low Stock</div>
            <div>Action</div>
          </Header>

          {loading && <Meta>Loading inventory...</Meta>}
          {!loading && filteredRows.map((item) => (
            <Row key={item.id} type="button" onClick={() => history.push(`/inventory/${item.id}`)}>
              <Cell>{item.id}</Cell>
              <Cell>{item.product_variant_id}</Cell>
              <Cell>{item.site_id}</Cell>
              <Cell>{item.qty_on_hand}</Cell>
              <Cell>{item.qty_reserved}</Cell>
              <Cell>{item.qty_available}</Cell>
              <Cell>{item.low_stock_threshold}</Cell>
              <Cell>View</Cell>
            </Row>
          ))}
        </Table>

        {error && <Meta>{error}</Meta>}
      </Surface>

      {showAddInventoryModal && (
        <AddInventoryModal
          onClose={() => setShowAddInventoryModal(false)}
          onCreateInventory={createProductStock}
          variantsByProductId={variantsByProductId}
        />
      )}
    </PageContent>
  )
}

export default InventoryListPage
