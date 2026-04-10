import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import QRCode from 'qrcode.react'
import PageContent from 'components/pages/PageContent'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import { PagePrimaryButton, PageSecondaryButton } from 'components/reusable/buttons/PageButtons'
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

const DetailSection = styled(Section)`
  position: relative;
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
  padding-right: 210px;
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
  max-width: 100%;
  box-sizing: border-box;
`

const DescriptionValue = styled.div`
  color: #243648;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
`

const QrWrap = styled.div`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f6f9fc;
  padding: 10px;
  width: fit-content;
`

const FloatingQrPanel = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f6f9fc;
  padding: 10px;
`

const QrCodeText = styled.div`
  color: #243648;
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;
  max-width: 170px;
  word-break: break-all;
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
  const [partInput, setPartInput] = useState('')
  const [partPrintHours, setPartPrintHours] = useState('')
  const [partBatchYield, setPartBatchYield] = useState('1')
  const [filamentRows, setFilamentRows] = useState([{ supplyInput: '', grams: '' }])
  const [consumableSupplyInput, setConsumableSupplyInput] = useState('')
  const [consumableQuantity, setConsumableQuantity] = useState('')
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
      { label: 'Products', to: '/products' },
      { label: 'Product Detail', to: `/products/${variantDetail ? variantDetail.product_id : ''}` },
      { label: 'Variant Detail' },
    ]}
    />
  )

  const filamentSupplySuggestions = useMemo(
    () => (supplies || [])
      .filter((item) => String(item.supply_type || 'filament').toLowerCase() !== 'consumable')
      .map((item) => ({ id: item.id, name: item.name || item.id })),
    [supplies],
  )

  const consumableSupplySuggestions = useMemo(
    () => (supplies || [])
      .filter((item) => String(item.supply_type || 'filament').toLowerCase() === 'consumable')
      .map((item) => ({ id: item.id, name: item.name || item.id })),
    [supplies],
  )

  const partSuggestions = useMemo(
    () => (parts || []).map((item) => ({ id: item.id, name: item.name, print_hours: Number(item.print_hours || 0) })),
    [parts],
  )

  const resolveSupplyByInput = (inputValue, mode) => {
    const normalized = String(inputValue || '').trim().toLowerCase()
    if (!normalized) return null
    const targetType = mode === 'consumable' ? 'consumable' : 'filament'
    return (supplies || []).find((item) => {
      const type = String(item.supply_type || 'filament').toLowerCase()
      if (targetType === 'consumable' && type !== 'consumable') return false
      if (targetType === 'filament' && type === 'consumable') return false
      return String(item.id || '').toLowerCase() === normalized || String(item.name || '').toLowerCase() === normalized
    }) || null
  }

  const partCostPreview = useMemo(() => {
    const yieldValue = Math.max(1, Number.parseInt(String(partBatchYield || '1'), 10) || 1)
    const total = (filamentRows || []).reduce((sum, row) => {
      const supply = resolveSupplyByInput(row.supplyInput, 'filament')
      if (!supply) return sum
      const gramsBatch = Number(row.grams || 0)
      if (gramsBatch <= 0) return sum
      const perUnitGrams = gramsBatch / yieldValue
      const costPerKilo = Number(supply.cost_per_kilo || 0)
      return sum + ((perUnitGrams / 1000) * costPerKilo)
    }, 0)
    return money(total)
  }, [filamentRows, partBatchYield, supplies])

  const filamentPartRows = useMemo(
    () => (recipeParts || [])
      .filter((part) => String(part.supply_type || '').toLowerCase() !== 'consumable')
      .map((part) => ({
      key: part.id,
      part_code: part.part_id || 'N/A',
      part_name: part.part_name || 'N/A',
      batch_yield: Number(part.batch_yield || 1),
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
    const isConsumableMode = String(addRecipePartMode || 'filament').toLowerCase() === 'consumable'
    try {
      if (isConsumableMode) {
        const supply = resolveSupplyByInput(consumableSupplyInput, 'consumable')
        if (!supply) {
          setRecipePartFormError('Consumable is required.')
          return
        }
        if (!consumableQuantity || Number(consumableQuantity) <= 0) {
          setRecipePartFormError('Quantity must be greater than zero.')
          return
        }
        await createRecipePart({
          part_id: null,
          supply_id: supply.id,
          grams: null,
          quantity: Number(consumableQuantity),
          print_hours: 0,
        })
      } else {
        const normalizedPartInput = String(partInput || '').trim()
        if (!normalizedPartInput) {
          setRecipePartFormError('Part is required.')
          return
        }
        let resolvedPart = (parts || []).find((item) => (
          String(item.id || '').toLowerCase() === normalizedPartInput.toLowerCase()
          || String(item.name || '').toLowerCase() === normalizedPartInput.toLowerCase()
        )) || null
        if (!resolvedPart) {
          if (Number(partPrintHours || 0) < 0) {
            setRecipePartFormError('Part print hours cannot be negative.')
            return
          }
          resolvedPart = await createPart({
            name: normalizedPartInput,
            description: null,
            print_hours: Number(partPrintHours || 0),
          })
        }
        const resolvedBatchYield = Math.max(1, Number.parseInt(String(partBatchYield || '1'), 10) || 1)
        if (resolvedBatchYield <= 0) {
          setRecipePartFormError('Yield must be at least 1.')
          return
        }
        const validRows = (filamentRows || [])
          .map((row) => ({
            supply: resolveSupplyByInput(row.supplyInput, 'filament'),
            grams: Number(row.grams || 0),
          }))
          .filter((row) => row.supply && row.grams > 0)
        if (!validRows.length) {
          setRecipePartFormError('Add at least one filament row with valid supply and grams.')
          return
        }
        await Promise.all(validRows.map((row) => createRecipePart({
          part_id: resolvedPart.id,
          supply_id: row.supply.id,
          grams: row.grams,
          quantity: null,
          print_hours: Number(resolvedPart.print_hours || partPrintHours || 0),
          batch_yield: resolvedBatchYield,
        })))
      }
      setPartInput('')
      setPartPrintHours('')
      setPartBatchYield('1')
      setFilamentRows([{ supplyInput: '', grams: '' }])
      setConsumableSupplyInput('')
      setConsumableQuantity('')
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
            {!isEditing && <PagePrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PagePrimaryButton>}
            {isEditing && <PagePrimaryButton type="button" onClick={handleSaveVariant}>SAVE</PagePrimaryButton>}
            {isEditing && (
              <PageSecondaryButton
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
              </PageSecondaryButton>
            )}
          </PageActions>
          <DetailSection>
            <SectionTitle>Variant Details</SectionTitle>
            <FloatingQrPanel>
              <Label>QR Code</Label>
              <QrWrap>
                <QRCode
                  value={variantDetail.qr_code || variantDetail.id}
                  size={150}
                  level="M"
                  includeMargin
                />
              </QrWrap>
              <QrCodeText>{variantDetail.qr_code || 'N/A'}</QrCodeText>
            </FloatingQrPanel>
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
          </DetailSection>

          <RelatedObjectsTableSection
            title="Parts"
            actions={(
              <PagePrimaryButton
                type="button"
                onClick={() => {
                  setAddRecipePartMode('filament')
                  setPartInput('')
                  setPartPrintHours('')
                  setPartBatchYield('1')
                  setFilamentRows([{ supplyInput: '', grams: '' }])
                  setRecipePartFormError('')
                  setShowAddRecipePartModal(true)
                }}
              >
                Add Part
              </PagePrimaryButton>
            )}
            columns={[
              { key: 'part_code', label: 'Part ID', width: '1.1fr' },
              { key: 'part_name', label: 'Part Name', width: '1.4fr' },
              { key: 'batch_yield', label: 'Yield', width: '0.7fr' },
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
              <PagePrimaryButton
                type="button"
                onClick={() => {
                  setAddRecipePartMode('consumable')
                  setConsumableSupplyInput('')
                  setConsumableQuantity('')
                  setRecipePartFormError('')
                  setShowAddRecipePartModal(true)
                }}
              >
                Add Consumable
              </PagePrimaryButton>
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
            mode={addRecipePartMode}
            partInput={partInput}
            partPrintHours={partPrintHours}
            partBatchYield={partBatchYield}
            partCostPreview={partCostPreview}
            filamentRows={filamentRows}
            consumableSupplyInput={consumableSupplyInput}
            consumableQuantity={consumableQuantity}
            partSuggestions={partSuggestions}
            filamentSupplySuggestions={filamentSupplySuggestions}
            consumableSupplySuggestions={consumableSupplySuggestions}
            selectedSupplyCostHint=""
            formError={recipePartFormError}
            onChangePartInput={(value) => {
              setPartInput(value)
              const existing = (parts || []).find((item) => (
                String(item.id || '').toLowerCase() === String(value || '').trim().toLowerCase()
                || String(item.name || '').toLowerCase() === String(value || '').trim().toLowerCase()
              ))
              if (existing) setPartPrintHours(String(Number(existing.print_hours || 0)))
            }}
            onChangePartPrintHours={setPartPrintHours}
            onChangePartBatchYield={setPartBatchYield}
            onAddFilamentRow={() => setFilamentRows((prev) => [...prev, { supplyInput: '', grams: '' }])}
            onRemoveFilamentRow={(index) => setFilamentRows((prev) => prev.filter((_, idx) => idx !== index))}
            onChangeFilamentRow={(index, field, value) => {
              setFilamentRows((prev) => prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row)))
            }}
            onChangeConsumableSupplyInput={setConsumableSupplyInput}
            onChangeConsumableQuantity={setConsumableQuantity}
            onClose={() => setShowAddRecipePartModal(false)}
            onSubmit={handleCreateRecipePart}
          />
        </>
      )}
    </PageContent>
  )
}

export default VariantDetailPage
