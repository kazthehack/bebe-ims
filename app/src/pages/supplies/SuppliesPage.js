import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import FormModal from 'components/reusable/modals/FormModal'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import ListPageShell from 'components/reusable/layouts/ListPageShell'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { deleteJson, getJson, postJson, putJson, tenantQuery } from 'hooks/http/httpClient'

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

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

const Divider = styled.div`
  margin: 12px 0;
  border-top: 1px solid #d7e0ec;
  padding-top: 12px;
`

const StockRemaining = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7fafc;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  padding: 10px 12px;
  margin-top: 8px;
`

const RemainingLabel = styled.div`
  color: #607589;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
`

const RemainingValue = styled.div`
  color: #243648;
  font-size: 16px;
  font-weight: 700;
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

const Field = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #4b6176;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const Textarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 96px;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
`

const ErrorMeta = styled.div`
  margin-top: 8px;
  color: #9f1f1f;
  background: #fdeaea;
  border: 1px solid #f3b7b7;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
`

const DeltaControls = styled.div`
  display: grid;
  gap: 10px;
`

const DeltaRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 10px;
  align-items: end;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const SHOW_OPTIONAL_TEXTAREA_BY_TAB = {
  filaments: false,
  supplies: true,
}

const SuppliesPage = () => {
  const tenantId = 'tenant-admin'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [supplies, setSupplies] = useState([])
  const [tab, setTab] = useState('filaments')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formError, setFormError] = useState('')

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [materialType, setMaterialType] = useState('PLA')
  const [subType, setSubType] = useState('Basic')
  const [color, setColor] = useState('')
  const [stockSpools, setStockSpools] = useState('0')
  const [spoolWeight, setSpoolWeight] = useState('1000')
  const [estimatedRemainingWeight, setEstimatedRemainingWeight] = useState('0')
  const [packsOnHand, setPacksOnHand] = useState('0')
  const [piecesPerPack, setPiecesPerPack] = useState('100')
  const [source, setSource] = useState('')
  const [sourceUrls, setSourceUrls] = useState('')
  const [costPerKilo, setCostPerKilo] = useState('0')
  const [costPerPackMin, setCostPerPackMin] = useState('0')
  const [costPerPackMax, setCostPerPackMax] = useState('0')
  const [associatedVariants, setAssociatedVariants] = useState([])
  const [loadingAssociations, setLoadingAssociations] = useState(false)
  const [deltas, setDeltas] = useState([])
  const [deltaMode, setDeltaMode] = useState('add')
  const [deltaAmount, setDeltaAmount] = useState('')
  const [deltaNote, setDeltaNote] = useState('')
  const [deltaLoading, setDeltaLoading] = useState(false)
  const [deltaError, setDeltaError] = useState('')

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Inventory', to: '/inventory' },
      { label: 'Supplies' },
    ]}
    />
  )

  const showOptionalTextarea = Boolean(SHOW_OPTIONAL_TEXTAREA_BY_TAB[tab])
  const piecesPerPackValue = Number(piecesPerPack || 0)
  const costPerPackMinValue = Number(costPerPackMin || 0)
  const costPerPackMaxValue = Number(costPerPackMax || 0)
  const costPerPackAverageValue = ((costPerPackMinValue || 0) + (costPerPackMaxValue || 0)) / 2
  const costPerPieceComputedValue = piecesPerPackValue > 0 ? (costPerPackAverageValue / piecesPerPackValue) : 0

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/stock/supplies?${tenantQuery(tenantId)}`)
      setSupplies(data.supplies || [])
    } catch (err) {
      setError(err.message || 'Failed to load supplies.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const fillFormFromRecord = (record) => {
    const isFilament = String(record.supply_type).toLowerCase() === 'filament'
    setTab(isFilament ? 'filaments' : 'supplies')
    setName(record.name || '')
    setBrand(record.brand || '')
    setMaterialType(record.material_type || 'PLA')
    setSubType(record.sub_type || 'Basic')
    setColor(record.color || '')
    setStockSpools(String(record.stock_spools || 0))
    setSpoolWeight(String(record.spool_weight_grams || 1000))
    setEstimatedRemainingWeight(String(record.estimated_remaining_weight_grams || 0))
    setPacksOnHand(String(record.qty_on_hand || 0))
    setPiecesPerPack(String(record.pieces_per_pack || 100))
    setSource(record.source || '')
    setSourceUrls((record.source_urls || []).join('\n'))
    setCostPerKilo(String(record.cost_per_kilo || 0))
    setCostPerPackMin(String(record.cost_per_pack_min || record.cost_per_pack || 0))
    setCostPerPackMax(String(record.cost_per_pack_max || record.cost_per_pack || 0))
  }

  const rowsByTab = useMemo(() => {
    const filteredByType = (supplies || []).filter((item) => (
      tab === 'filaments'
        ? String(item.supply_type || '').toLowerCase() === 'filament'
        : String(item.supply_type || '').toLowerCase() === 'consumable'
    ))
    const q = search.trim().toLowerCase()
    const filtered = !q
      ? filteredByType
      : filteredByType.filter((item) => (
        (item.name || '').toLowerCase().includes(q)
        || (item.brand || '').toLowerCase().includes(q)
        || (item.material_type || '').toLowerCase().includes(q)
        || (item.sub_type || '').toLowerCase().includes(q)
        || (item.color || '').toLowerCase().includes(q)
      ))

    return filtered.map((item) => ({
      key: item.id,
      brand: item.brand || 'N/A',
      type: item.material_type || 'N/A',
      sub_type: item.sub_type || 'N/A',
      color: item.color || 'N/A',
      name: item.name || 'N/A',
      stock_spools: Number(item.stock_spools || 0),
      estimated_remaining_weight_grams: Number(item.estimated_remaining_weight_grams || 0),
      packs_on_hand: Number(item.qty_on_hand || 0),
      pieces_per_pack: Number(item.pieces_per_pack || 0),
      cost_range: `${money(item.cost_per_pack_min || 0)} - ${money(item.cost_per_pack_max || 0)}`,
      subtotal_cost: money(item.cost_per_pack || 0),
      cost_per_gram: money(item.cost_per_gram || 0),
      cost_per_piece: money(item.cost_per_piece || 0),
      actions: (
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionButton type="button" onClick={() => setSelectedId(item.id)}>VIEW</ActionButton>
          <ActionButton type="button" onClick={() => {
            setModalMode('edit')
            setEditingId(item.id)
            fillFormFromRecord(item)
            setShowCreate(true)
          }}
          >
            EDIT
          </ActionButton>
          <ActionButton type="button" onClick={() => setDeleteTarget(item)}>DELETE</ActionButton>
        </div>
      ),
    }))
  }, [supplies, tab, search])

  const selected = useMemo(
    () => (supplies || []).find((item) => item.id === selectedId) || null,
    [supplies, selectedId],
  )

  useEffect(() => {
    const run = async () => {
      if (!selected) {
        setAssociatedVariants([])
        setDeltas([])
        return
      }
      if (String(selected.supply_type).toLowerCase() !== 'filament') {
        setAssociatedVariants([])
      } else {
        setLoadingAssociations(true)
        try {
          const data = await getJson(`/stock/filaments/${encodeURIComponent(selected.id)}/variants?${tenantQuery(tenantId)}`)
          setAssociatedVariants(data.variants || [])
        } catch {
          setAssociatedVariants([])
        } finally {
          setLoadingAssociations(false)
        }
      }
      try {
        const data = await getJson(`/stock/adjustments?${tenantQuery(tenantId)}`)
        const filtered = (data.adjustments || [])
          .filter((item) => item.target_type === 'supply' && item.target_id === selected.id)
          .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))
        setDeltas(filtered)
      } catch {
        setDeltas([])
      }
    }
    run()
  }, [selected])

  const resetForm = () => {
    setName('')
    setBrand('')
    setMaterialType('PLA')
    setSubType('Basic')
    setColor('')
    setStockSpools('0')
    setSpoolWeight('1000')
    setEstimatedRemainingWeight('0')
    setPacksOnHand('0')
    setPiecesPerPack('100')
    setSource('')
    setSourceUrls('')
    setCostPerKilo('0')
    setCostPerPackMin('0')
    setCostPerPackMax('0')
    setFormError('')
  }

  const openCreate = () => {
    setModalMode('create')
    setEditingId(null)
    resetForm()
    setShowCreate(true)
  }

  const saveSupply = async () => {
    setFormError('')
    if (!name.trim()) {
      setFormError('Name is required.')
      return
    }
    try {
      const isFilament = tab === 'filaments'
      const payload = {
        name: name.trim(),
        supply_type: isFilament ? 'filament' : 'consumable',
        brand: isFilament ? (brand.trim() || null) : null,
        material_type: isFilament ? (materialType || null) : null,
        sub_type: isFilament ? (subType || null) : null,
        color: isFilament ? (color.trim() || null) : null,
        stock_spools: isFilament ? Number(stockSpools || 0) : 0,
        spool_weight_grams: isFilament ? Number(spoolWeight || 1000) : 0,
        estimated_remaining_weight_grams: isFilament ? Number(estimatedRemainingWeight || 0) : 0,
        grams_on_hand: isFilament ? Number(estimatedRemainingWeight || 0) : 0,
        qty_on_hand: isFilament ? 0 : Number(packsOnHand || 0),
        pieces_per_pack: isFilament ? 1 : Number(piecesPerPack || 1),
        source: source.trim() || null,
        source_urls: String(sourceUrls || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        cost_per_kilo: isFilament ? Number(costPerKilo || 0) : 0,
        cost_per_pack_min: isFilament ? 0 : Number(costPerPackMin || 0),
        cost_per_pack_max: isFilament ? 0 : Number(costPerPackMax || 0),
        cost_per_pack: isFilament ? 0 : costPerPackAverageValue,
        cost_per_piece: isFilament ? 0 : costPerPieceComputedValue,
      }
      if (modalMode === 'edit' && editingId) {
        await putJson(`/stock/supplies/${encodeURIComponent(editingId)}?${tenantQuery(tenantId)}`, payload)
      } else {
        await postJson(`/stock/supplies?${tenantQuery(tenantId)}`, payload)
      }
      setShowCreate(false)
      await load()
    } catch (err) {
      setFormError(err.message || 'Failed to save supply.')
    }
  }

  const saveDelta = async () => {
    if (!selected) return
    setDeltaError('')
    const parsed = Number(deltaAmount || 0)
    if (parsed <= 0) {
      setDeltaError('Quantity is required.')
      return
    }
    const signedDelta = deltaMode === 'dispense' ? parsed * -1 : parsed
    try {
      setDeltaLoading(true)
      await postJson(`/stock/adjustments?${tenantQuery(tenantId)}`, {
        target_type: 'supply',
        target_id: selected.id,
        adjustment_type: deltaMode === 'dispense' ? 'dispense' : 'refill',
        qty_delta: signedDelta,
        notes: (deltaNote || '').trim() || null,
      })
      setDeltaAmount('')
      setDeltaNote('')
      await load()
      const data = await getJson(`/stock/adjustments?${tenantQuery(tenantId)}`)
      const filtered = (data.adjustments || [])
        .filter((item) => item.target_type === 'supply' && item.target_id === selected.id)
        .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))
      setDeltas(filtered)
    } catch (err) {
      setDeltaError(err.message || 'Failed to apply stock delta.')
    } finally {
      setDeltaLoading(false)
    }
  }

  if (selected) {
    const isFilament = String(selected.supply_type).toLowerCase() === 'filament'
    const detailBreadcrumb = (
      <BreadcrumbTitle items={[
        { label: 'Inventory', to: '/inventory' },
        { label: 'Supplies' },
        { label: isFilament ? 'Filament Detail' : 'Consumable Detail' },
      ]}
      />
    )
    return (
      <PageContent title={detailBreadcrumb}>
        <PageActions>
          <div style={{ display: 'flex', gap: 8 }}>
            <SecondaryButton type="button" onClick={() => setSelectedId(null)}>Back</SecondaryButton>
            <PrimaryButton
              type="button"
              onClick={() => {
                setModalMode('edit')
                setEditingId(selected.id)
                fillFormFromRecord(selected)
                setShowCreate(true)
              }}
            >
              EDIT
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => setDeleteTarget(selected)}>DELETE</SecondaryButton>
          </div>
        </PageActions>
        <Section>
          <SectionTitle>{isFilament ? 'Filament Details' : 'Consumable Details'}</SectionTitle>
          <Grid>
            <div><Label>ID</Label><Value>{selected.id}</Value></div>
            <div><Label>Name</Label><Value>{selected.name || 'N/A'}</Value></div>
            <div><Label>Brand</Label><Value>{selected.brand || 'N/A'}</Value></div>
            <div><Label>Type</Label><Value>{selected.material_type || 'N/A'}</Value></div>
            <div><Label>Sub Type</Label><Value>{selected.sub_type || 'N/A'}</Value></div>
            <div><Label>Color</Label><Value>{selected.color || 'N/A'}</Value></div>
            {isFilament && <div><Label>Stock (Spools)</Label><Value>{Number(selected.stock_spools || 0)}</Value></div>}
            {isFilament && <div><Label>Weight / Spool (g)</Label><Value>{Number(selected.spool_weight_grams || 0)}</Value></div>}
            {isFilament && <div><Label>Estimated Remaining (g)</Label><Value>{Number(selected.estimated_remaining_weight_grams || 0)}</Value></div>}
            {!isFilament && <div><Label>Packs On Hand</Label><Value>{Number(selected.qty_on_hand || 0)}</Value></div>}
            {!isFilament && <div><Label>Pieces / Pack</Label><Value>{Number(selected.pieces_per_pack || 0)}</Value></div>}
            <div><Label>Source</Label><Value>{selected.source || 'N/A'}</Value></div>
            {isFilament && <div><Label>Cost / Gram</Label><Value>{money(selected.cost_per_gram || 0)}</Value></div>}
            {isFilament && <div><Label>Cost / Kilo</Label><Value>{money(selected.cost_per_kilo || 0)}</Value></div>}
            {!isFilament && <div><Label>Cost Range / Pack</Label><Value>{`${money(selected.cost_per_pack_min || 0)} - ${money(selected.cost_per_pack_max || 0)}`}</Value></div>}
            {!isFilament && <div><Label>Subtotal Cost (Avg / Pack)</Label><Value>{money(selected.cost_per_pack || 0)}</Value></div>}
            {!isFilament && <div><Label>Cost / Piece</Label><Value>{money(selected.cost_per_piece || 0)}</Value></div>}
          </Grid>
          <Divider>
            <RemainingLabel>Total Stock Remaining</RemainingLabel>
            <StockRemaining>
              <RemainingLabel>{isFilament ? 'Available Grams' : 'Available Packs'}</RemainingLabel>
              <RemainingValue>
                {isFilament
                  ? `${Number(
                    selected.grams_available !== undefined && selected.grams_available !== null
                      ? selected.grams_available
                      : (selected.estimated_remaining_weight_grams || 0),
                  ).toFixed(2)} g`
                  : Number(selected.qty_available || 0).toFixed(2)}
              </RemainingValue>
            </StockRemaining>
          </Divider>
          <SectionTitle style={{ marginTop: 14 }}>Source URLs</SectionTitle>
          <Value style={{ minHeight: 'auto', alignItems: 'flex-start', whiteSpace: 'pre-wrap' }}>
            {(selected.source_urls || []).length > 0 ? selected.source_urls.join('\n') : 'N/A'}
          </Value>
        </Section>

        <Section>
          <SectionTitle>Stock Deltas</SectionTitle>
          <DeltaControls>
            <DeltaRow>
              <Field>Action
                <Select value={deltaMode} onChange={(event) => setDeltaMode(event.target.value)}>
                  <option value="add">Add Stock (Purchase)</option>
                  <option value="dispense">Dispense Stock</option>
                </Select>
              </Field>
              <Field>{isFilament ? 'Grams' : 'Packs'}
                <Input type="number" min="0.01" step="0.01" value={deltaAmount} onChange={(event) => setDeltaAmount(event.target.value)} />
              </Field>
              <Field>Note
                <Input value={deltaNote} onChange={(event) => setDeltaNote(event.target.value)} placeholder="Optional note" />
              </Field>
              <PrimaryButton type="button" disabled={deltaLoading} onClick={saveDelta}>
                {deltaLoading ? 'Saving...' : 'Apply'}
              </PrimaryButton>
            </DeltaRow>
            {deltaError && <ErrorMeta>{deltaError}</ErrorMeta>}
          </DeltaControls>
          <RelatedObjectsTableSection
            title="Purchase / Displacement History"
            columns={[
              { key: 'created_at', label: 'When', width: '1.2fr' },
              { key: 'adjustment_type', label: 'Type', width: '0.8fr' },
              { key: 'qty_delta', label: 'Delta', width: '0.8fr' },
              { key: 'notes', label: 'Notes', width: '1.6fr' },
            ]}
            rows={(deltas || []).map((row) => ({
              key: row.id,
              created_at: new Date(row.created_at).toLocaleString(),
              adjustment_type: String(row.adjustment_type || '').toUpperCase(),
              qty_delta: Number(row.qty_delta || 0).toFixed(2),
              notes: row.notes || 'N/A',
            }))}
            emptyText="No stock delta records yet."
          />
        </Section>

        {isFilament && (
          <RelatedObjectsTableSection
            title="Associated Product Variants"
            columns={[
              { key: 'variant_sku', label: 'Variant SKU', width: '1fr' },
              { key: 'variant_name', label: 'Variant Name', width: '1.2fr' },
              { key: 'product_name', label: 'Product', width: '1.2fr' },
            ]}
            rows={(associatedVariants || []).map((row) => ({
              key: row.variant_id,
              variant_sku: row.variant_sku,
              variant_name: row.variant_name || 'N/A',
              product_name: row.product_name || 'N/A',
            }))}
            loadingText={loadingAssociations ? 'Loading associated variants...' : ''}
            emptyText="No associated variants."
          />
        )}
      </PageContent>
    )
  }

  return (
    <PageContent title={breadcrumbTitle}>
      <ListPageShell
        tabs={[
          { key: 'filaments', label: 'Filaments' },
          { key: 'supplies', label: 'Supplies' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={tab === 'filaments' ? 'Search brand, type, color, name' : 'Search consumables'}
        primaryActionLabel={tab === 'filaments' ? 'Add Filament' : 'Add Supply'}
        onPrimaryAction={openCreate}
      >
        {error && <Section>{error}</Section>}

        <RelatedObjectsTableSection
          title={tab === 'filaments' ? 'Filaments' : 'Consumables'}
          columns={tab === 'filaments'
            ? [
                { key: 'brand', label: 'Brand', width: '1fr' },
                { key: 'type', label: 'Type', width: '0.8fr' },
                { key: 'sub_type', label: 'Sub Type', width: '1fr' },
                { key: 'color', label: 'Color', width: '0.8fr' },
                { key: 'name', label: 'Name', width: '1.1fr' },
                { key: 'stock_spools', label: 'Stock (Spool)', width: '0.9fr' },
                { key: 'estimated_remaining_weight_grams', label: 'Est. Remaining (g)', width: '1fr' },
                { key: 'cost_per_gram', label: 'Cost / Gram', width: '0.9fr' },
                { key: 'actions', label: 'Actions', width: '0.8fr' },
              ]
            : [
                { key: 'name', label: 'Name', width: '1.2fr' },
                { key: 'packs_on_hand', label: 'Packs', width: '0.8fr' },
                { key: 'pieces_per_pack', label: 'Pieces / Pack', width: '0.9fr' },
                { key: 'cost_range', label: 'Cost Range / Pack', width: '1.2fr' },
                { key: 'subtotal_cost', label: 'Subtotal (Avg)', width: '0.9fr' },
                { key: 'cost_per_piece', label: 'Cost / Piece', width: '0.9fr' },
                { key: 'actions', label: 'Actions', width: '0.8fr' },
              ]}
          rows={rowsByTab}
          loadingText={loading ? 'Loading supplies...' : ''}
          emptyText={error || 'No records found.'}
        />
      </ListPageShell>

      <FormModal
        open={showCreate}
        title={modalMode === 'edit'
          ? (tab === 'filaments' ? 'Edit Filament' : 'Edit Supply')
          : (tab === 'filaments' ? 'Add Filament' : 'Add Supply')}
        onClose={() => setShowCreate(false)}
        onConfirm={saveSupply}
        confirmLabel={modalMode === 'edit' ? 'Save' : 'Create'}
        cancelLabel="Cancel"
        width="620px"
        actionsAlign="right"
        closeControl="glyph"
      >
        <Field>Name *<Input value={name} onChange={(event) => setName(event.target.value)} /></Field>
        {tab === 'filaments' && (
          <>
            <Field>Brand<Input value={brand} onChange={(event) => setBrand(event.target.value)} /></Field>
            <Field>Type<Select value={materialType} onChange={(event) => setMaterialType(event.target.value)}>
              <option value="PLA">PLA</option>
              <option value="PETG">PETG</option>
            </Select></Field>
            <Field>Sub Type<Select value={subType} onChange={(event) => setSubType(event.target.value)}>
              <option value="Basic">Basic</option>
              <option value="Matte">Matte</option>
              <option value="Silk">Silk</option>
              <option value="Marble">Marble</option>
              <option value="Carbon Fiber">CF - Carbon Fiber</option>
              <option value="Glow">Glow</option>
            </Select></Field>
            <Field>Color<Input value={color} onChange={(event) => setColor(event.target.value)} /></Field>
            <Field>Stock (Spool Count)<Input type="number" min="0" value={stockSpools} onChange={(event) => setStockSpools(event.target.value)} /></Field>
            <Field>Weight per Spool (grams)<Input type="number" min="0" value={spoolWeight} onChange={(event) => setSpoolWeight(event.target.value)} /></Field>
            <Field>Estimated Remaining Weight (grams)<Input type="number" min="0" value={estimatedRemainingWeight} onChange={(event) => setEstimatedRemainingWeight(event.target.value)} /></Field>
            <Field>Cost per Kilo (PHP)<Input type="number" min="0" step="0.01" value={costPerKilo} onChange={(event) => setCostPerKilo(event.target.value)} /></Field>
          </>
        )}
        {tab === 'supplies' && (
          <>
            <Field>Packs On Hand<Input type="number" min="0" value={packsOnHand} onChange={(event) => setPacksOnHand(event.target.value)} /></Field>
            <Field>Pieces per Pack<Input type="number" min="1" value={piecesPerPack} onChange={(event) => setPiecesPerPack(event.target.value)} /></Field>
            <Field>Cost per Pack Min (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMin} onChange={(event) => setCostPerPackMin(event.target.value)} /></Field>
            <Field>Cost per Pack Max (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMax} onChange={(event) => setCostPerPackMax(event.target.value)} /></Field>
            <Field>Subtotal Cost (Avg / Pack)<Input type="number" value={costPerPackAverageValue.toFixed(2)} readOnly /></Field>
            <Field>Cost per Piece (Auto)<Input type="number" value={costPerPieceComputedValue.toFixed(4)} readOnly /></Field>
          </>
        )}
        <Field>Source<Input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Supplier / channel" /></Field>
        {showOptionalTextarea && (
          <Field>Source URLs (one per line)<Textarea value={sourceUrls} onChange={(event) => setSourceUrls(event.target.value)} /></Field>
        )}
        {formError && <ErrorMeta>{formError}</ErrorMeta>}
      </FormModal>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title={tab === 'filaments' ? 'Delete Filament' : 'Delete Supply'}
        description={`You are deleting: ${deleteTarget ? deleteTarget.name : ''}`}
        helperText="This action cannot be undone."
        helperVariant="danger"
        requiredText={deleteTarget ? deleteTarget.id : ''}
        requiredTextLabel="Type ID to confirm"
        inputPlaceholder="Enter supply ID"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteJson(`/stock/supplies/${encodeURIComponent(deleteTarget.id)}?${tenantQuery(tenantId)}`)
          if (selectedId === deleteTarget.id) setSelectedId(null)
          setDeleteTarget(null)
          await load()
        }}
      />
    </PageContent>
  )
}

export default SuppliesPage
