import React, { useState } from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import { useStockResource } from 'hooks/bazaar/useBazaarApi'

const Surface = styled.div`
  border: 1px solid #d8e1eb;
  background: #f4f7fa;
  border-radius: 4px;
  padding: 12px;
`

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const Card = styled.div`
  border: 1px solid #d8e1eb;
  background: #fff;
  border-radius: 4px;
  padding: 12px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 0.8fr 0.8fr 0.8fr;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 13px;
`

const Input = styled.input`
  border: 1px solid #bfd0e0;
  border-radius: 4px;
  height: 36px;
  padding: 0 10px;
  margin-bottom: 6px;
  width: 100%;
`

const Button = styled.button`
  border: 1px solid #23384e;
  background: #23384e;
  color: #fff;
  border-radius: 4px;
  height: 36px;
  padding: 0 12px;
  cursor: pointer;
`

const SuppliesPage = () => {
  const {
    loading,
    error,
    supplies,
    filaments,
    createSupply,
    createFilament,
  } = useStockResource()

  const [supplyName, setSupplyName] = useState('')
  const [supplyCostPerKilo, setSupplyCostPerKilo] = useState('')
  const [supplyOnHand, setSupplyOnHand] = useState('')
  const [filamentBrand, setFilamentBrand] = useState('')
  const [filamentColor, setFilamentColor] = useState('')
  const [filamentGrams, setFilamentGrams] = useState('')

  const submitSupply = async () => {
    await createSupply({
      name: supplyName,
      cost_per_kilo: Number(supplyCostPerKilo || 0),
      qty_on_hand: Number(supplyOnHand || 0),
      qty_reserved: 0,
    })
    setSupplyName('')
    setSupplyCostPerKilo('')
    setSupplyOnHand('')
  }

  const submitFilament = async () => {
    await createFilament({
      brand: filamentBrand,
      color: filamentColor,
      current_grams: Number(filamentGrams || 0),
      reserved_grams: 0,
    })
    setFilamentBrand('')
    setFilamentColor('')
    setFilamentGrams('')
  }

  return (
    <PageContent title="Supplies">
      <Surface>
        <TwoCol>
          <Card>
            <h3>Supplies</h3>
            <Row style={{ fontWeight: 700 }}>
              <div>Name</div>
              <div>Cost / Kilo</div>
              <div>On Hand</div>
              <div>Reserved</div>
              <div>Available</div>
            </Row>
            {loading && <div>Loading supplies...</div>}
            {supplies.map(item => (
              <Row key={item.id}>
                <div>{item.name}</div>
                <div>{item.cost_per_kilo}</div>
                <div>{item.qty_on_hand}</div>
                <div>{item.qty_reserved}</div>
                <div>{item.qty_available}</div>
              </Row>
            ))}
            <h4 style={{ marginTop: 12 }}>Add Supply</h4>
            <Input placeholder="Supply name" value={supplyName} onChange={event => setSupplyName(event.target.value)} />
            <Input placeholder="Cost per kilo" type="number" value={supplyCostPerKilo} onChange={event => setSupplyCostPerKilo(event.target.value)} />
            <Input placeholder="Qty on hand" type="number" value={supplyOnHand} onChange={event => setSupplyOnHand(event.target.value)} />
            <Button type="button" onClick={submitSupply}>Create Supply</Button>
          </Card>

          <Card>
            <h3>Filaments</h3>
            <Row style={{ fontWeight: 700 }}>
              <div>Brand / Color</div>
              <div>Current g</div>
              <div>Reserved g</div>
              <div>Available g</div>
            </Row>
            {loading && <div>Loading filaments...</div>}
            {filaments.map(item => (
              <Row key={item.id}>
                <div>{item.brand} / {item.color}</div>
                <div>{item.current_grams}</div>
                <div>{item.reserved_grams}</div>
                <div>{item.available_grams}</div>
              </Row>
            ))}
            <h4 style={{ marginTop: 12 }}>Add Filament</h4>
            <Input placeholder="Brand" value={filamentBrand} onChange={event => setFilamentBrand(event.target.value)} />
            <Input placeholder="Color" value={filamentColor} onChange={event => setFilamentColor(event.target.value)} />
            <Input placeholder="Current grams" type="number" value={filamentGrams} onChange={event => setFilamentGrams(event.target.value)} />
            <Button type="button" onClick={submitFilament}>Create Filament</Button>
          </Card>
        </TwoCol>
        {error && <Card style={{ marginTop: 12 }}>{error}</Card>}
      </Surface>
    </PageContent>
  )
}

export default SuppliesPage
