import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import { useStockResource } from 'hooks/bazaar/useBazaarApi'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 14px;
`

const Card = styled.div`
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  padding: 12px;
  margin-bottom: 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid #d2dae4;
`

const InventoryDetailPage = () => {
  const { id } = useParams()
  const { productStock, loading, error } = useStockResource()
  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Inventory', to: '/inventory' },
      { label: 'Stock', to: '/inventory' },
      { label: 'Inventory Detail' },
    ]}
    />
  )

  const item = useMemo(
    () => (productStock || []).find((row) => row.id === id),
    [id, productStock],
  )

  return (
    <PageContent title={breadcrumbTitle}>
      <Surface>
        {loading && <Card>Loading inventory detail...</Card>}
        {!loading && error && <Card>{error}</Card>}
        {!loading && !item && <Card>Inventory record not found.</Card>}
        {!loading && item && (
          <Card>
            <Row><strong>ID</strong><span>{item.id}</span></Row>
            <Row><strong>Product Variant ID</strong><span>{item.product_variant_id}</span></Row>
            <Row><strong>Site ID</strong><span>{item.site_id}</span></Row>
            <Row><strong>Qty On Hand</strong><span>{item.qty_on_hand}</span></Row>
            <Row><strong>Qty Reserved</strong><span>{item.qty_reserved}</span></Row>
            <Row><strong>Qty Available</strong><span>{item.qty_available}</span></Row>
            <Row><strong>Low Stock Threshold</strong><span>{item.low_stock_threshold}</span></Row>
          </Card>
        )}
      </Surface>
    </PageContent>
  )
}

export default InventoryDetailPage
