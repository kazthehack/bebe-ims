import React from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import { useProductDetail } from 'hooks/products/useProductsApi'

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`

const BackButton = styled.button`
  border: 1px solid #1f2f45;
  background: #ffffff;
  color: #1f2f45;
  border-radius: 8px;
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`

const Card = styled.div`
  border: 1px solid #d7e0ec;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  background: #ffffff;
`

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1f2f45;
  margin-bottom: 8px;
`

const Sub = styled.div`
  font-size: 13px;
  color: #4d4d4d;
  margin-bottom: 8px;
`

const Table = styled.div`
  border: 1px solid #d7e0ec;
  border-radius: 8px;
  overflow: hidden;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.6fr 0.8fr;
  border-bottom: 1px solid #e3e9f2;
  background: ${({ $header }) => ($header ? '#f5f8fc' : '#ffffff')};
`

const Cell = styled.div`
  padding: 9px 10px;
  border-right: 1px solid #e3e9f2;
  font-size: 12px;
  color: #1f2f45;
  font-weight: ${({ $header }) => ($header ? 700 : 400)};

  &:last-child {
    border-right: 0;
  }
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const ProductDetailPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const { product, loading, error } = useProductDetail(id)

  return (
    <PageContent title="Product Details">
      <Top>
        <BackButton type="button" onClick={() => history.push('/inventory')}>Back to Inventory</BackButton>
      </Top>

      {loading && <Card>Loading product details...</Card>}
      {!loading && error && <Card>{error}</Card>}

      {!loading && product && (
        <>
          <Card>
            <Title>{product.name}</Title>
            <Sub>{`Category: ${product.category}`}</Sub>
            <Sub>{`Variants: ${(product.variants || []).join(', ')}`}</Sub>
            <Sub>{`Total Cost of Production: ${money(product.total_cost_php)}`}</Sub>
          </Card>

          {(product.parts || []).map(part => (
            <Card key={part.id}>
              <Title>{`${part.name} (${part.part_type})`}</Title>
              <Sub>{`Part Cost: ${money(part.cost_php)}`}</Sub>

              <Table>
                <Row $header>
                  <Cell $header>Material</Cell>
                  <Cell $header>Quantity</Cell>
                  <Cell $header>UOM</Cell>
                  <Cell $header>Cost</Cell>
                </Row>
                {(part.materials || []).map(material => (
                  <Row key={material.id}>
                    <Cell>{material.name}</Cell>
                    <Cell>{material.quantity}</Cell>
                    <Cell>{material.uom}</Cell>
                    <Cell>{money(material.cost_php)}</Cell>
                  </Row>
                ))}
              </Table>
            </Card>
          ))}
        </>
      )}
    </PageContent>
  )
}

export default ProductDetailPage
