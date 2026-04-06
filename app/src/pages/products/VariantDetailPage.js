import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { useVariantDetail } from 'hooks/products/useProductsApi'
import AddRecipePartModal from './modals/AddRecipePartModal'

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

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

const DescriptionValue = styled.div`
  color: #243648;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const VariantDetailPage = () => {
  const { id } = useParams()
  const {
    variantDetail,
    recipeParts,
    parts,
    recipeTotalCost,
    recipeSummary,
    supplies,
    loading,
    error,
    createPart,
    createRecipePart,
    updateVariant,
  } = useVariantDetail(id)

  const [showAddRecipePartModal, setShowAddRecipePartModal] = useState(false)
  const [addRecipePartMode, setAddRecipePartMode] = useState('filament')
  const [recipePartId, setRecipePartId] = useState('')
  const [recipeNewPartName, setRecipeNewPartName] = useState('')
  const [recipePartSupplyId, setRecipePartSupplyId] = useState('')
  const [recipePartGrams, setRecipePartGrams] = useState('')
  const [recipePartQuantity, setRecipePartQuantity] = useState('')
  const [recipePartPrintHours, setRecipePartPrintHours] = useState('')
  const [recipePartFormError, setRecipePartFormError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [variantName, setVariantName] = useState('')
  const [variantYieldUnits, setVariantYieldUnits] = useState('1')
  const [variantPrintHours, setVariantPrintHours] = useState('0')
  const [variantFormError, setVariantFormError] = useState('')

  React.useEffect(() => {
    if (!variantDetail) return
    setVariantName(variantDetail.name || '')
    setVariantYieldUnits(String(variantDetail.yield_units || 1))
    setVariantPrintHours(String(variantDetail.print_hours || 0))
  }, [variantDetail])

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Inventory', to: '/inventory' },
      { label: 'Products', to: '/products' },
      { label: 'Product Detail', to: `/products/${variantDetail ? variantDetail.product_id : ''}` },
      { label: 'Variant Detail' },
    ]}
    />
  )

  const supplyOptions = useMemo(() => {
    const normalizedMode = String(addRecipePartMode || 'filament').toLowerCase()
    return (supplies || [])
      .filter((item) => {
        const type = String(item.supply_type || 'filament').toLowerCase()
        if (normalizedMode === 'consumable') return type === 'consumable'
        return type !== 'consumable'
      })
      .map((item) => ({
      id: item.id,
      label: `${item.name || item.id} (${item.supply_type || 'filament'})`,
      supply_type: item.supply_type || 'filament',
      }))
  }, [supplies, addRecipePartMode])

  const selectedSupply = useMemo(
    () => (supplies || []).find((item) => item.id === recipePartSupplyId) || null,
    [supplies, recipePartSupplyId],
  )

  const partOptions = useMemo(
    () => (parts || []).map((item) => ({ id: item.id, label: `${item.name} (${item.id})` })),
    [parts],
  )

  const selectedSupplyType = String(
    (selectedSupply && selectedSupply.supply_type) || addRecipePartMode || 'filament',
  ).toLowerCase()

  const selectedSupplyCostPerKilo = useMemo(
    () => money(selectedSupply ? selectedSupply.cost_per_kilo : 0),
    [selectedSupply],
  )
  const selectedSupplyCostPerPiece = useMemo(
    () => money(selectedSupply ? selectedSupply.cost_per_piece : 0),
    [selectedSupply],
  )

  const filamentPartRows = useMemo(
    () => (recipeParts || [])
      .filter((part) => String(part.supply_type || '').toLowerCase() !== 'consumable')
      .map((part) => ({
      key: part.id,
      part_code: part.part_id || 'N/A',
      part_name: part.part_name || 'N/A',
      filament: part.filament_name || part.supply_name || part.supply_id || 'N/A',
      grams: Number(part.grams || 0),
      required_grams_for_batch: Number(part.required_grams_for_batch || 0),
      cost_per_kilo: money(part.cost_per_kilo),
      cost_of_part: money(part.cost_of_part),
      print_hours: Number(part.print_hours || 0),
    })),
    [recipeParts],
  )

  const consumableRows = useMemo(
    () => (recipeParts || [])
      .filter((part) => String(part.supply_type || '').toLowerCase() === 'consumable')
      .map((part) => ({
        key: part.id,
        consumable: part.supply_name || part.supply_id || 'N/A',
        quantity: Number(part.quantity || 0),
        required_quantity_for_batch: Number(part.required_quantity_for_batch || 0),
        cost_per_piece: money(part.cost_per_piece),
        cost_of_part: money(part.cost_of_part),
      })),
    [recipeParts],
  )

  const supplyRows = useMemo(() => {
    const grouped = {}
    ;(recipeParts || []).forEach((part) => {
      const key = String(part.supply_id || part.supply_name || part.id)
      if (!grouped[key]) {
        grouped[key] = {
          key,
          supply: part.supply_name || part.supply_id || 'N/A',
          supply_type: String(part.supply_type || 'filament').toLowerCase(),
          available_quantity: Number(part.available_quantity || 0),
          available_grams: Number(part.available_grams || 0),
          required_quantity_for_batch: 0,
          required_grams_for_batch: 0,
        }
      }
      grouped[key].required_grams_for_batch += Number(part.required_grams_for_batch || 0)
      grouped[key].required_quantity_for_batch += Number(part.required_quantity_for_batch || 0)
    })
    return Object.values(grouped).map((item) => {
      const remainingGrams = Number(item.available_grams || 0) - Number(item.required_grams_for_batch || 0)
      const remainingQty = Number(item.available_quantity || 0) - Number(item.required_quantity_for_batch || 0)
      const canProduce = item.supply_type === 'consumable'
        ? remainingQty >= 0
        : remainingGrams >= 0
      return {
        key: item.key,
        supply: item.supply,
        supply_type: item.supply_type,
        available_quantity: Number(item.available_quantity || 0),
        available_grams: Number(item.available_grams || 0),
        required_quantity_for_batch: Number(item.required_quantity_for_batch || 0),
        required_grams_for_batch: Number(item.required_grams_for_batch || 0),
        remaining_quantity_after_batch: remainingQty,
        remaining_grams_after_batch: remainingGrams,
        can_produce: canProduce ? 'Yes' : 'No',
      }
    })
  }, [recipeParts])

  const handleCreateRecipePart = async () => {
    setRecipePartFormError('')
    if (!recipePartSupplyId.trim()) {
      setRecipePartFormError('Supply is required.')
      return
    }
    if (selectedSupplyType !== 'consumable' && !recipePartId.trim() && !recipeNewPartName.trim()) {
      setRecipePartFormError('Part is required. Select an existing part or provide a new part name.')
      return
    }
    if (selectedSupplyType === 'consumable' && (!recipePartQuantity || Number(recipePartQuantity) <= 0)) {
      setRecipePartFormError('Quantity must be greater than zero.')
      return
    }
    if (selectedSupplyType !== 'consumable' && (!recipePartGrams || Number(recipePartGrams) <= 0)) {
      setRecipePartFormError('Grams must be greater than zero.')
      return
    }
    try {
      let resolvedPartId = recipePartId.trim()
      if (selectedSupplyType !== 'consumable' && !resolvedPartId && recipeNewPartName.trim()) {
        const createdPart = await createPart({
          name: recipeNewPartName.trim(),
          description: null,
        })
        resolvedPartId = createdPart.id
      }
      await createRecipePart({
        part_id: selectedSupplyType === 'consumable' ? null : resolvedPartId,
        supply_id: recipePartSupplyId,
        grams: selectedSupplyType === 'consumable' ? null : Number(recipePartGrams),
        quantity: selectedSupplyType === 'consumable' ? Number(recipePartQuantity) : null,
        print_hours: Number(recipePartPrintHours || 0),
      })
      setRecipePartId('')
      setRecipeNewPartName('')
      setRecipePartSupplyId('')
      setRecipePartGrams('')
      setRecipePartQuantity('')
      setRecipePartPrintHours('')
      setShowAddRecipePartModal(false)
    } catch (err) {
      setRecipePartFormError(err.message || 'Failed to create recipe part.')
    }
  }

  const handleSaveVariant = async () => {
    setVariantFormError('')
    if (!variantYieldUnits || Number(variantYieldUnits) < 1) {
      setVariantFormError('Yield must be at least 1.')
      return
    }
    try {
      await updateVariant({
        name: variantName.trim() || null,
        yield_units: Number(variantYieldUnits),
        print_hours: Number(variantPrintHours || 0),
      })
    } catch (err) {
      setVariantFormError(err.message || 'Failed to update variant.')
    }
  }

  return (
    <PageContent title={breadcrumbTitle}>
      {loading && <Section>Loading variant details...</Section>}
      {!loading && error && <Section>{error}</Section>}
      {!loading && variantDetail && (
        <>
          <PageActions>
            {!isEditing && <PrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PrimaryButton>}
            {isEditing && <PrimaryButton type="button" onClick={handleSaveVariant}>SAVE</PrimaryButton>}
            {isEditing && (
              <SecondaryButton
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setVariantFormError('')
                  setVariantName(variantDetail.name || '')
                  setVariantYieldUnits(String(variantDetail.yield_units || 1))
                  setVariantPrintHours(String(variantDetail.print_hours || 0))
                }}
              >
                CANCEL
              </SecondaryButton>
            )}
          </PageActions>
          <Section>
            <SectionTitle>Variant Details</SectionTitle>
            <Grid>
              <div>
                <Label>Variant ID</Label>
                <Value>{variantDetail.id}</Value>
              </div>
              <div>
                <Label>SKU</Label>
                <Value>{variantDetail.sku || 'N/A'}</Value>
              </div>
              <div>
                <Label>Name</Label>
                {!isEditing && <Value>{variantDetail.name || 'N/A'}</Value>}
                {isEditing && <Input value={variantName} onChange={event => setVariantName(event.target.value)} />}
              </div>
              <div>
                <Label>Total Cost</Label>
                <Value>{money(recipeTotalCost)}</Value>
              </div>
              <div>
                <Label>Yield (units)</Label>
                {!isEditing && <Value>{variantDetail.yield_units || 1}</Value>}
                {isEditing && (
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={variantYieldUnits}
                    onChange={event => setVariantYieldUnits(event.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Variant Print Hours</Label>
                {!isEditing && <Value>{variantDetail.print_hours || 0}</Value>}
                {isEditing && (
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variantPrintHours}
                    onChange={event => setVariantPrintHours(event.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Price Per Unit</Label>
                <Value>{money((recipeSummary && recipeSummary.price_per_unit) || 0)}</Value>
              </div>
              <div>
                <Label>Hours Per Unit</Label>
                <Value>{Number((recipeSummary && recipeSummary.hours_per_unit) || 0)}</Value>
              </div>
              <div>
                <Label>Total Batch Hours</Label>
                <Value>{Number((recipeSummary && recipeSummary.total_batch_hours) || 0)}</Value>
              </div>
              <div>
                <Label>Can Produce Batch</Label>
                <Value>{(recipeSummary && recipeSummary.can_produce_batch) === false ? 'No' : 'Yes'}</Value>
              </div>
            </Grid>
            {variantFormError && <DescriptionValue>{variantFormError}</DescriptionValue>}
          </Section>

          <RelatedObjectsTableSection
            title="Parts"
            actions={(
              <PrimaryButton
                type="button"
                onClick={() => {
                  setAddRecipePartMode('filament')
                  setRecipePartId('')
                  setRecipeNewPartName('')
                  setRecipePartSupplyId('')
                  setRecipePartFormError('')
                  setShowAddRecipePartModal(true)
                }}
              >
                Add Part
              </PrimaryButton>
            )}
            columns={[
              { key: 'part_code', label: 'Part ID', width: '1.1fr' },
              { key: 'part_name', label: 'Part Name', width: '1.4fr' },
              { key: 'filament', label: 'Filament', width: '1.4fr' },
              { key: 'grams', label: 'Grams / Unit', width: '0.8fr' },
              { key: 'required_grams_for_batch', label: 'Required Grams / Batch', width: '1fr' },
              { key: 'cost_per_kilo', label: 'Cost / Kilo', width: '1fr' },
              { key: 'cost_of_part', label: 'Cost of Part', width: '1fr' },
              { key: 'print_hours', label: 'Part Print Hours', width: '1fr' },
            ]}
            rows={filamentPartRows}
            loadingText={loading ? 'Loading parts...' : ''}
            emptyText={error ? error : 'No parts yet.'}
          />

          <RelatedObjectsTableSection
            title="Consumables"
            actions={(
              <PrimaryButton
                type="button"
                onClick={() => {
                  setAddRecipePartMode('consumable')
                  setRecipePartId('')
                  setRecipeNewPartName('')
                  setRecipePartSupplyId('')
                  setRecipePartFormError('')
                  setShowAddRecipePartModal(true)
                }}
              >
                Add Consumable
              </PrimaryButton>
            )}
            columns={[
              { key: 'consumable', label: 'Consumable', width: '1.6fr' },
              { key: 'quantity', label: 'Qty / Unit', width: '0.8fr' },
              { key: 'required_quantity_for_batch', label: 'Required Qty / Batch', width: '1fr' },
              { key: 'cost_per_piece', label: 'Cost / Piece', width: '1fr' },
              { key: 'cost_of_part', label: 'Cost of Item', width: '1fr' },
            ]}
            rows={consumableRows}
            loadingText={loading ? 'Loading consumables...' : ''}
            emptyText={error ? error : 'No consumables yet.'}
          />

          <RelatedObjectsTableSection
            title="Supplies Readiness"
            columns={[
              { key: 'supply', label: 'Supply', width: '1.4fr' },
              { key: 'supply_type', label: 'Type', width: '0.8fr' },
              { key: 'available_quantity', label: 'Available Qty', width: '0.9fr' },
              { key: 'available_grams', label: 'Available Grams', width: '0.9fr' },
              { key: 'required_quantity_for_batch', label: 'Required Qty / Batch', width: '1fr' },
              { key: 'required_grams_for_batch', label: 'Required Grams / Batch', width: '1fr' },
              { key: 'remaining_quantity_after_batch', label: 'Remaining Qty', width: '0.9fr' },
              { key: 'remaining_grams_after_batch', label: 'Remaining Grams', width: '0.9fr' },
              { key: 'can_produce', label: 'Can Produce', width: '0.8fr' },
            ]}
            rows={supplyRows}
            loadingText={loading ? 'Loading supplies...' : ''}
            emptyText={error ? error : 'No supplies linked to parts yet.'}
          />

          <AddRecipePartModal
            open={showAddRecipePartModal}
            partId={recipePartId}
            newPartName={recipeNewPartName}
            supplyId={recipePartSupplyId}
            supplyType={selectedSupplyType}
            grams={recipePartGrams}
            quantity={recipePartQuantity}
            printHours={recipePartPrintHours}
            partOptions={partOptions}
            supplyOptions={supplyOptions}
            selectedSupplyCostPerKilo={selectedSupplyCostPerKilo}
            selectedSupplyCostPerPiece={selectedSupplyCostPerPiece}
            formError={recipePartFormError}
            onChangePartId={setRecipePartId}
            onChangeNewPartName={setRecipeNewPartName}
            onChangeSupplyId={setRecipePartSupplyId}
            onChangeQuantity={setRecipePartQuantity}
            onChangeGrams={setRecipePartGrams}
            onChangePrintHours={setRecipePartPrintHours}
            onClose={() => setShowAddRecipePartModal(false)}
            onSubmit={handleCreateRecipePart}
          />
        </>
      )}
    </PageContent>
  )
}

export default VariantDetailPage
