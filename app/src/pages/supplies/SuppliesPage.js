import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import RelatedObjectsTableSection from 'components/reusable/details/RelatedObjectsTableSection'
import FormModal from 'components/reusable/modals/FormModal'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import ListPageShell from 'components/reusable/layouts/ListPageShell'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
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

const ListTable = styled.div`
  display: grid;
  gap: 6px;
`

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ListRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
`

const ListCell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const PaginationBar = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

const PaginationButton = styled.button`
  height: 30px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  min-width: 64px;
  cursor: pointer;
`

const PAGE_SIZE = 20

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

const StockSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f7fafc;
  overflow: hidden;
`

const StockSummaryCell = styled.div`
  padding: 10px 12px;
  border-right: 1px solid #d7e0ec;

  &:last-child {
    border-right: 0;
  }
`

const StockSummaryValue = styled.div`
  color: #243648;
  font-size: 16px;
  font-weight: 700;
`

const StockSummaryLabel = styled.div`
  color: #607589;
  font-size: 12px;
  text-transform: uppercase;
  margin-top: 4px;
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

const ValueLink = styled.a`
  color: #1f4f7a;
  text-decoration: underline;
  word-break: break-all;
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

const ErrorMeta = styled.div`
  margin-top: 8px;
  color: #9f1f1f;
  background: #fdeaea;
  border: 1px solid #f3b7b7;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const formatCostRange = (minValue, maxValue) => {
  const min = Number(minValue || 0)
  const max = Number(maxValue || 0)
  if (Math.abs(min - max) < 0.000001) return money(min)
  return `${money(min)} - ${money(max)}`
}

const buildFilamentName = ({ brand, materialType, subType, color }) => (
  [brand, materialType, subType, color]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(' ')
)

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
  const [sourceUrl, setSourceUrl] = useState('')
  const [costPerKilo, setCostPerKilo] = useState('0')
  const [costPerPackMin, setCostPerPackMin] = useState('0')
  const [costPerPackMax, setCostPerPackMax] = useState('0')
  const [associatedVariants, setAssociatedVariants] = useState([])
  const [loadingAssociations, setLoadingAssociations] = useState(false)
  const [allAdjustments, setAllAdjustments] = useState([])
  const [brandOptions, setBrandOptions] = useState([])
  const [deltas, setDeltas] = useState([])
  const [deltaMode, setDeltaMode] = useState('add')
  const [deltaAmount, setDeltaAmount] = useState('')
  const [deltaNote, setDeltaNote] = useState('')
  const [deltaLoading, setDeltaLoading] = useState(false)
  const [deltaError, setDeltaError] = useState('')
  const [showDeltaModal, setShowDeltaModal] = useState(false)
  const [activeSpools, setActiveSpools] = useState([])
  const [loadingActiveSpools, setLoadingActiveSpools] = useState(false)
  const [showActiveModal, setShowActiveModal] = useState(false)
  const [activeEditTarget, setActiveEditTarget] = useState(null)
  const [activeGrams, setActiveGrams] = useState('')
  const [activeNotes, setActiveNotes] = useState('')
  const [activeError, setActiveError] = useState('')
  const [activeSaving, setActiveSaving] = useState(false)
  const [listPage, setListPage] = useState(1)

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      { label: 'Supplies' },
    ]}
    />
  )

  const piecesPerPackValue = Number(piecesPerPack || 0)
  const costPerPackMinValue = Number(costPerPackMin || 0)
  const costPerPackMaxValue = Number(costPerPackMax || 0)
  const costPerPackAverageValue = ((costPerPackMinValue || 0) + (costPerPackMaxValue || 0)) / 2
  const costPerPieceComputedValue = piecesPerPackValue > 0 ? (costPerPackAverageValue / piecesPerPackValue) : 0
  const filamentNamePreview = buildFilamentName({
    brand,
    materialType,
    subType,
    color,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [suppliesData, adjustmentsData, brandsData] = await Promise.all([
        getJson(`/stock/supplies?${tenantQuery(tenantId)}`),
        getJson(`/stock/adjustments?${tenantQuery(tenantId)}`),
        getJson(`/stock/brands?${tenantQuery(tenantId)}`),
      ])
      setSupplies(suppliesData.supplies || [])
      setAllAdjustments(adjustmentsData.adjustments || [])
      setBrandOptions(brandsData.brands || [])
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
    setSourceUrl(record.source_url || '')
    setCostPerKilo(String(record.cost_per_kilo || 0))
    setCostPerPackMin(String(record.cost_per_pack_min || record.cost_per_pack || 0))
    setCostPerPackMax(String(record.cost_per_pack_max || record.cost_per_pack || 0))
  }

  const lastOrderDateBySupplyId = useMemo(() => {
    const index = {}
    ;(allAdjustments || []).forEach((item) => {
      if (String(item.target_type || '').toLowerCase() !== 'supply') return
      if (Number(item.qty_delta || 0) <= 0) return
      const current = index[item.target_id]
      const when = String(item.created_at || '')
      if (!current || when > current) index[item.target_id] = when
    })
    return index
  }, [allAdjustments])

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
      grams_left: `${Number(
        item.grams_available !== undefined && item.grams_available !== null
          ? item.grams_available
          : (item.estimated_remaining_weight_grams || 0),
      ).toFixed(2)} g`,
      estimated_remaining_weight_grams: Number(item.estimated_remaining_weight_grams || 0),
      packs_left: Number(item.qty_available || 0).toFixed(2),
      approx_pcs_left: (Number(item.qty_available || 0) * Number(item.pieces_per_pack || 0)).toFixed(0),
      pieces_per_pack: Number(item.pieces_per_pack || 0),
      last_order_date: lastOrderDateBySupplyId[item.id]
        ? new Date(lastOrderDateBySupplyId[item.id]).toLocaleDateString()
        : 'N/A',
      cost_range: formatCostRange(item.cost_per_pack_min, item.cost_per_pack_max),
      subtotal_cost: money(item.cost_per_pack || 0),
      cost_per_gram: money(item.cost_per_gram || 0),
      cost_per_piece: money(item.cost_per_piece || 0),
      actions: (
        <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
          <ActionButton type="button" onClick={() => setSelectedId(item.id)}>VIEW</ActionButton>
          <span>|</span>
          <ActionButton type="button" onClick={() => setDeleteTarget(item)}>DELETE</ActionButton>
        </div>
      ),
    }))
  }, [supplies, tab, search, lastOrderDateBySupplyId])

  const listColumns = useMemo(
    () => (tab === 'filaments'
      ? [
          { key: 'brand', label: 'Brand', width: '1fr' },
          { key: 'type', label: 'Type', width: '0.8fr' },
          { key: 'sub_type', label: 'Sub Type', width: '1fr' },
          { key: 'color', label: 'Color', width: '0.8fr' },
          { key: 'name', label: 'Name', width: '1.1fr' },
          { key: 'grams_left', label: 'Grams Left', width: '1fr' },
          { key: 'last_order_date', label: 'Last Order Date', width: '1fr' },
          { key: 'cost_per_gram', label: 'Cost / Gram', width: '0.9fr' },
          { key: 'actions', label: 'Actions', width: '1.2fr' },
        ]
      : [
          { key: 'name', label: 'Name', width: '1.2fr' },
          { key: 'packs_left', label: 'Packs Left', width: '0.9fr' },
          { key: 'approx_pcs_left', label: 'Approx Pcs Left', width: '1fr' },
          { key: 'last_order_date', label: 'Last Order Date', width: '1fr' },
          { key: 'actions', label: 'Actions', width: '1.2fr' },
        ]),
    [tab],
  )

  const listGridTemplate = useMemo(
    () => listColumns.map((column) => column.width).join(' '),
    [listColumns],
  )

  const listTotalPages = Math.max(1, Math.ceil((rowsByTab || []).length / PAGE_SIZE))
  const safeListPage = Math.min(listPage, listTotalPages)
  const pagedRowsByTab = (rowsByTab || []).slice((safeListPage - 1) * PAGE_SIZE, safeListPage * PAGE_SIZE)

  useEffect(() => {
    setListPage(1)
  }, [tab, search])

  const selected = useMemo(
    () => (supplies || []).find((item) => item.id === selectedId) || null,
    [supplies, selectedId],
  )

  useEffect(() => {
    const run = async () => {
      if (!selected) {
        setAssociatedVariants([])
        setDeltas([])
        setActiveSpools([])
        return
      }
      if (String(selected.supply_type).toLowerCase() !== 'filament') {
        setAssociatedVariants([])
        setActiveSpools([])
      } else {
        setLoadingAssociations(true)
        setLoadingActiveSpools(true)
        try {
          const [variantData, activeData] = await Promise.all([
            getJson(`/stock/filaments/${encodeURIComponent(selected.id)}/variants?${tenantQuery(tenantId)}`),
            getJson(`/stock/filaments/${encodeURIComponent(selected.id)}/active?${tenantQuery(tenantId)}`),
          ])
          setAssociatedVariants(variantData.variants || [])
          setActiveSpools(activeData.entries || [])
        } catch {
          setAssociatedVariants([])
          setActiveSpools([])
        } finally {
          setLoadingAssociations(false)
          setLoadingActiveSpools(false)
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
    setSourceUrl('')
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

  const normalizeBrandId = (value) => (
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  )

  const ensureBrandAndGetDisplay = async (inputValue) => {
    const normalized = normalizeBrandId(inputValue)
    if (!normalized) return ''
    const existing = (brandOptions || []).find((item) => item.id === normalized)
    if (existing) return existing.display_name
    const created = await postJson(`/stock/brands?${tenantQuery(tenantId)}`, { brand: inputValue })
    const display = created.display_name || inputValue.trim()
    setBrandOptions((prev) => {
      const deduped = (prev || []).filter((item) => item.id !== created.id)
      return [...deduped, created].sort((a, b) => String(a.display_name).localeCompare(String(b.display_name)))
    })
    return display
  }

  const saveSupply = async () => {
    setFormError('')
    const isFilament = tab === 'filaments'
    if (!isFilament && !name.trim()) {
      setFormError('Name is required.')
      return
    }
    try {
      let resolvedBrand = null
      if (isFilament) {
        const display = await ensureBrandAndGetDisplay(brand)
        resolvedBrand = display || null
        if (!resolvedBrand) {
          setFormError('Brand is required.')
          return
        }
      }
      const resolvedName = isFilament
        ? buildFilamentName({ brand: resolvedBrand, materialType, subType, color })
        : name.trim()
      if (!resolvedName) {
        setFormError('Name is required.')
        return
      }
      const payload = {
        name: resolvedName,
        supply_type: isFilament ? 'filament' : 'consumable',
        brand: isFilament ? resolvedBrand : null,
        material_type: isFilament ? (materialType || null) : null,
        sub_type: isFilament ? (subType || null) : null,
        color: isFilament ? (color.trim() || null) : null,
        stock_spools: isFilament ? Number(stockSpools || 0) : 0,
        spool_weight_grams: isFilament ? Number(spoolWeight || 1000) : 0,
        estimated_remaining_weight_grams: isFilament ? Number(estimatedRemainingWeight || 0) : 0,
        grams_on_hand: isFilament ? Number(estimatedRemainingWeight || 0) : 0,
        qty_on_hand: isFilament ? 0 : Number(packsOnHand || 0),
        pieces_per_pack: isFilament ? 1 : Number(piecesPerPack || 1),
        source_url: sourceUrl.trim() || null,
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

  const handleCostPerPackMinChange = (nextValue) => {
    const previousMin = String(costPerPackMin || '')
    const currentMax = String(costPerPackMax || '')
    const shouldMirror = currentMax.trim() === '' || currentMax === previousMin
    setCostPerPackMin(nextValue)
    if (shouldMirror) {
      setCostPerPackMax(nextValue)
    }
  }

  const openDeltaModal = () => {
    setDeltaError('')
    setDeltaAmount('')
    setDeltaNote('')
    setDeltaMode('add')
    setShowDeltaModal(true)
  }

  const openPullToActiveModal = () => {
    if (!selected) return
    setActiveEditTarget(null)
    setActiveError('')
    setActiveNotes('')
    setActiveGrams(String(Number(selected.spool_weight_grams || 1000)))
    setShowActiveModal(true)
  }

  const openAdjustActiveModal = (entry) => {
    setActiveEditTarget(entry)
    setActiveError('')
    setActiveNotes(entry.notes || '')
    setActiveGrams(String(Number(entry.grams_remaining || 0)))
    setShowActiveModal(true)
  }

  const saveActiveSpool = async () => {
    if (!selected) return
    const grams = Number(activeGrams || 0)
    if (grams < 0) {
      setActiveError('Grams cannot be negative.')
      return
    }
    try {
      setActiveSaving(true)
      setActiveError('')
      let createdRow = null
      if (activeEditTarget) {
        await putJson(
          `/stock/filaments/${encodeURIComponent(selected.id)}/active/${encodeURIComponent(activeEditTarget.id)}?${tenantQuery(tenantId)}`,
          { grams_remaining: grams, notes: activeNotes.trim() || null },
        )
      } else {
        const created = await postJson(`/stock/filaments/${encodeURIComponent(selected.id)}/active?${tenantQuery(tenantId)}`, {
          grams_remaining: grams > 0 ? grams : null,
          notes: activeNotes.trim() || null,
        })
        createdRow = created
        if (created && created.id) {
          setActiveSpools((prev) => {
            const deduped = (prev || []).filter((entry) => entry.id !== created.id)
            return [created, ...deduped]
          })
        }
      }
      const [supplyData, activeData] = await Promise.all([
        getJson(`/stock/supplies?${tenantQuery(tenantId)}`),
        getJson(`/stock/filaments/${encodeURIComponent(selected.id)}/active?${tenantQuery(tenantId)}`),
      ])
      setSupplies(supplyData.supplies || [])
      setActiveSpools((prev) => {
        const serverRows = activeData.entries || []
        if (serverRows.length > 0) return serverRows
        if (createdRow && createdRow.id) {
          const deduped = (prev || []).filter((entry) => entry.id !== createdRow.id)
          return [createdRow, ...deduped]
        }
        return prev || []
      })
      setShowActiveModal(false)
      setActiveEditTarget(null)
    } catch (err) {
      setActiveError(err.message || 'Failed to save active spool.')
    } finally {
      setActiveSaving(false)
    }
  }

  const deleteActiveSpool = async (entry) => {
    if (!selected) return
    try {
      await deleteJson(`/stock/filaments/${encodeURIComponent(selected.id)}/active/${encodeURIComponent(entry.id)}?${tenantQuery(tenantId)}`)
      const activeData = await getJson(`/stock/filaments/${encodeURIComponent(selected.id)}/active?${tenantQuery(tenantId)}`)
      setActiveSpools(activeData.entries || [])
    } catch (err) {
      setError(err.message || 'Failed to delete active spool.')
    }
  }

  const lastOrderDate = useMemo(() => {
    const latestInbound = (deltas || []).find((item) => (
      ['ADD', 'REFILL', 'TRANSFER_IN'].includes(String(item.adjustment_type || '').toUpperCase())
      && Number(item.qty_delta || 0) > 0
    ))
    return latestInbound ? new Date(latestInbound.created_at).toLocaleDateString() : 'N/A'
  }, [deltas])
  const approxPiecesLeft = useMemo(() => {
    if (!selected || String(selected.supply_type).toLowerCase() === 'filament') return null
    const packsLeft = Number(selected.qty_available || 0)
    const piecesPerPackCount = Number(selected.pieces_per_pack || 0)
    return packsLeft * piecesPerPackCount
  }, [selected])

  const saveDelta = async () => {
    if (!selected) return
    setDeltaError('')
    const isFilament = String(selected.supply_type).toLowerCase() === 'filament'
    const parsed = isFilament
      ? Number.parseInt(String(deltaAmount || '0'), 10)
      : Number(deltaAmount || 0)
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
      setShowDeltaModal(false)
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
        { label: 'Supplies', onClick: () => setSelectedId(null) },
        { label: isFilament ? 'Filament Detail' : 'Consumable Detail' },
      ]}
      />
    )
    return (
      <PageContent title={detailBreadcrumb}>
        <PageActions>
          <div style={{ display: 'flex', gap: 8 }}>
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
            {!isFilament && <div><Label>Pieces / Pack</Label><Value>{Number(selected.pieces_per_pack || 0)}</Value></div>}
            {isFilament && <div><Label>Cost / Gram</Label><Value>{money(selected.cost_per_gram || 0)}</Value></div>}
            {isFilament && <div><Label>Cost / Kilo</Label><Value>{money(selected.cost_per_kilo || 0)}</Value></div>}
            {!isFilament && <div><Label>Cost Range / Pack</Label><Value>{formatCostRange(selected.cost_per_pack_min, selected.cost_per_pack_max)}</Value></div>}
            {!isFilament && <div><Label>Subtotal Cost (Avg / Pack)</Label><Value>{money(selected.cost_per_pack || 0)}</Value></div>}
            {!isFilament && <div><Label>Cost / Piece</Label><Value>{money(selected.cost_per_piece || 0)}</Value></div>}
          </Grid>
          <SectionTitle style={{ marginTop: 14 }}>Source URL</SectionTitle>
          <Value style={{ minHeight: 'auto', alignItems: 'flex-start', whiteSpace: 'pre-wrap', display: 'grid', gap: 6 }}>
            {selected.source_url
              ? (
                <ValueLink href={selected.source_url} target="_blank" rel="noreferrer">
                  {selected.source_url}
                </ValueLink>
              )
              : 'N/A'}
          </Value>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle style={{ margin: 0 }}>Stock</SectionTitle>
            <SecondaryButton type="button" onClick={openDeltaModal}>Add Adjustment</SecondaryButton>
          </SectionHeader>
          <StockSummaryGrid>
            <StockSummaryCell>
              <StockSummaryValue>
                {isFilament
                  ? `${Number(
                    selected.grams_available !== undefined && selected.grams_available !== null
                      ? selected.grams_available
                      : (selected.estimated_remaining_weight_grams || 0),
                  ).toFixed(2)} g`
                  : Number(selected.qty_available || 0).toFixed(2)}
              </StockSummaryValue>
              <StockSummaryLabel>{isFilament ? 'grams left' : 'packs left'}</StockSummaryLabel>
            </StockSummaryCell>
            <StockSummaryCell>
              <StockSummaryValue>
                {approxPiecesLeft === null ? 'N/A' : Number(approxPiecesLeft).toFixed(0)}
              </StockSummaryValue>
              <StockSummaryLabel>approx pcs left</StockSummaryLabel>
            </StockSummaryCell>
            <StockSummaryCell>
              <StockSummaryValue>{lastOrderDate}</StockSummaryValue>
              <StockSummaryLabel>last order date</StockSummaryLabel>
            </StockSummaryCell>
          </StockSummaryGrid>
          {isFilament && (
            <RelatedObjectsTableSection
              title="Active Spool"
              columns={[
                { key: 'active_id', label: 'ID', width: '1fr' },
                { key: 'grams_remaining', label: 'Grams Remaining', width: '0.9fr' },
                { key: 'updated_at', label: 'Updated', width: '1fr' },
                { key: 'notes', label: 'Notes', width: '1.2fr' },
                { key: 'actions', label: 'Actions', width: '1fr' },
              ]}
              rows={(activeSpools || []).map((entry) => ({
                key: entry.id,
                active_id: entry.id,
                grams_remaining: `${Number(entry.grams_remaining || 0).toFixed(2)} g`,
                updated_at: entry.updated_at ? new Date(entry.updated_at).toLocaleString() : 'N/A',
                notes: entry.notes || 'N/A',
                actions: (
                  <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                    <ActionButton type="button" onClick={() => openAdjustActiveModal(entry)}>ADJUST</ActionButton>
                    <ActionButton type="button" onClick={() => deleteActiveSpool(entry)}>DELETE</ActionButton>
                  </div>
                ),
              }))}
              loadingText={loadingActiveSpools ? 'Loading active spools...' : ''}
              emptyText="No active spools."
              actions={(
                <SecondaryButton type="button" onClick={openPullToActiveModal}>Pull To Active</SecondaryButton>
              )}
            />
          )}
          <RelatedObjectsTableSection
            title="Adjustments"
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

        <FormModal
          open={showActiveModal}
          title={activeEditTarget ? 'Adjust Active Spool' : 'Pull Spool To Active'}
          onClose={() => {
            setShowActiveModal(false)
            setActiveEditTarget(null)
          }}
          onConfirm={saveActiveSpool}
          confirmLabel={activeSaving ? 'Saving...' : (activeEditTarget ? 'Save' : 'Pull')}
          cancelLabel="Cancel"
          width="460px"
          actionsAlign="right"
          closeControl="dot"
        >
          <Field>Grams Remaining
            <Input type="number" min="0" step="0.01" value={activeGrams} onChange={(event) => setActiveGrams(event.target.value)} />
          </Field>
          <Field>Notes
            <Input value={activeNotes} onChange={(event) => setActiveNotes(event.target.value)} placeholder="Optional note" />
          </Field>
          {activeError && <ErrorMeta>{activeError}</ErrorMeta>}
        </FormModal>

        <FormModal
          open={showDeltaModal}
          title="Add Adjustment"
          onClose={() => setShowDeltaModal(false)}
          onConfirm={saveDelta}
          confirmLabel={deltaLoading ? 'Saving...' : 'Apply'}
          cancelLabel="Cancel"
          width="460px"
          actionsAlign="right"
          closeControl="dot"
        >
          <Field>Action
            <Select value={deltaMode} onChange={(event) => setDeltaMode(event.target.value)}>
              <option value="add">Add Stock (Purchase)</option>
              <option value="dispense">Dispense Stock</option>
            </Select>
          </Field>
          <Field>{selected && String(selected.supply_type).toLowerCase() === 'filament' ? 'Spools' : 'Packs'}
            <Input
              type="number"
              min={selected && String(selected.supply_type).toLowerCase() === 'filament' ? '1' : '0.01'}
              step={selected && String(selected.supply_type).toLowerCase() === 'filament' ? '1' : '0.01'}
              value={deltaAmount}
              onChange={(event) => setDeltaAmount(event.target.value)}
            />
          </Field>
          <Field>Note
            <Input value={deltaNote} onChange={(event) => setDeltaNote(event.target.value)} placeholder="Optional note" />
          </Field>
          {deltaError && <ErrorMeta>{deltaError}</ErrorMeta>}
        </FormModal>

        <FormModal
          open={showCreate}
          title={modalMode === 'edit' ? (isFilament ? 'Edit Filament' : 'Edit Supply') : (isFilament ? 'Add Filament' : 'Add Supply')}
          onClose={() => setShowCreate(false)}
          onConfirm={saveSupply}
          confirmLabel={modalMode === 'edit' ? 'Save' : 'Create'}
          cancelLabel="Cancel"
          width="620px"
          actionsAlign="right"
          closeControl="dot"
        >
          {!isFilament && <Field>Name *<Input value={name} onChange={(event) => setName(event.target.value)} /></Field>}
          {isFilament && (
            <>
              <Field>Name (Auto)
                <Input value={filamentNamePreview} readOnly placeholder="Brand + Type + Sub Type + Color" />
              </Field>
              <Field>Brand
                <Input
                  value={brand}
                  list="filament-brand-options"
                  onChange={(event) => setBrand(event.target.value)}
                  onBlur={async () => {
                    if (!brand.trim()) return
                    const display = await ensureBrandAndGetDisplay(brand)
                    if (display) setBrand(display)
                  }}
                  onKeyDown={async (event) => {
                    if (event.key !== 'Enter') return
                    event.preventDefault()
                    const display = await ensureBrandAndGetDisplay(brand)
                    if (display) setBrand(display)
                  }}
                />
                <datalist id="filament-brand-options">
                  {(brandOptions || []).map((option) => (
                    <option key={option.id} value={option.display_name} />
                  ))}
                </datalist>
              </Field>
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
              <Field>Cost per Kilo (PHP)<Input type="number" min="0" step="0.01" value={costPerKilo} onChange={(event) => setCostPerKilo(event.target.value)} /></Field>
            </>
          )}
          {!isFilament && (
            <>
              <Field>Packs On Hand<Input type="number" min="0" value={packsOnHand} onChange={(event) => setPacksOnHand(event.target.value)} /></Field>
              <Field>Pieces per Pack<Input type="number" min="1" value={piecesPerPack} onChange={(event) => setPiecesPerPack(event.target.value)} /></Field>
              <Field>Cost per Pack Min (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMin} onChange={(event) => handleCostPerPackMinChange(event.target.value)} /></Field>
              <Field>Cost per Pack Max (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMax} onChange={(event) => setCostPerPackMax(event.target.value)} /></Field>
              <Field>Subtotal Cost (Avg / Pack)<Input type="number" value={costPerPackAverageValue.toFixed(2)} readOnly /></Field>
              <Field>Cost per Piece (Auto)<Input type="number" value={costPerPieceComputedValue.toFixed(4)} readOnly /></Field>
            </>
          )}
          <Field>Source URL<Input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://example.com/item" /></Field>
          {formError && <ErrorMeta>{formError}</ErrorMeta>}
        </FormModal>

        <ConfirmActionModal
          open={Boolean(deleteTarget)}
          title={isFilament ? 'Delete Filament' : 'Delete Supply'}
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
        toolbar={(
          <ListFiltersRow
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={tab === 'filaments' ? 'Search brand, type, color, name' : 'Search consumables'}
            right={<PrimaryButton type="button" onClick={openCreate}>{tab === 'filaments' ? 'Add Filament' : 'Add Supply'}</PrimaryButton>}
          />
        )}
      >
        {error && <Section>{error}</Section>}
        <ListTable>
          <ListHeader $columns={listGridTemplate}>
            {listColumns.map((column) => (
              <div key={column.key}>{column.label}</div>
            ))}
          </ListHeader>

          {!loading && pagedRowsByTab.map((row) => (
            <ListRow key={row.key} $columns={listGridTemplate}>
              {listColumns.map((column) => (
                <ListCell key={`${row.key}-${column.key}`}>{row[column.key]}</ListCell>
              ))}
            </ListRow>
          ))}
        </ListTable>
        {loading && <Meta>Loading supplies...</Meta>}
        {!loading && !rowsByTab.length && <Meta>{error || 'No records found.'}</Meta>}
        {!loading && rowsByTab.length > 0 && (
          <PaginationBar>
            <Meta>Page {safeListPage} / {listTotalPages}</Meta>
            <PaginationButton type="button" onClick={() => setListPage(1)} disabled={safeListPage <= 1}>
              FIRST
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setListPage((prev) => Math.max(1, prev - 1))} disabled={safeListPage <= 1}>
              Prev
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setListPage((prev) => Math.min(listTotalPages, prev + 1))} disabled={safeListPage >= listTotalPages}>
              Next
            </PaginationButton>
          </PaginationBar>
        )}
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
        closeControl="dot"
      >
        {tab !== 'filaments' && <Field>Name *<Input value={name} onChange={(event) => setName(event.target.value)} /></Field>}
        {tab === 'filaments' && (
          <>
            <Field>Name (Auto)
              <Input value={filamentNamePreview} readOnly placeholder="Brand + Type + Sub Type + Color" />
            </Field>
            <Field>Brand
              <Input
                value={brand}
                list="filament-brand-options-list"
                onChange={(event) => setBrand(event.target.value)}
                onBlur={async () => {
                  if (!brand.trim()) return
                  const display = await ensureBrandAndGetDisplay(brand)
                  if (display) setBrand(display)
                }}
                onKeyDown={async (event) => {
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  const display = await ensureBrandAndGetDisplay(brand)
                  if (display) setBrand(display)
                }}
              />
              <datalist id="filament-brand-options-list">
                {(brandOptions || []).map((option) => (
                  <option key={option.id} value={option.display_name} />
                ))}
              </datalist>
            </Field>
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
            <Field>Cost per Kilo (PHP)<Input type="number" min="0" step="0.01" value={costPerKilo} onChange={(event) => setCostPerKilo(event.target.value)} /></Field>
          </>
        )}
        {tab === 'supplies' && (
          <>
            <Field>Packs On Hand<Input type="number" min="0" value={packsOnHand} onChange={(event) => setPacksOnHand(event.target.value)} /></Field>
            <Field>Pieces per Pack<Input type="number" min="1" value={piecesPerPack} onChange={(event) => setPiecesPerPack(event.target.value)} /></Field>
            <Field>Cost per Pack Min (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMin} onChange={(event) => handleCostPerPackMinChange(event.target.value)} /></Field>
            <Field>Cost per Pack Max (PHP)<Input type="number" min="0" step="0.01" value={costPerPackMax} onChange={(event) => setCostPerPackMax(event.target.value)} /></Field>
            <Field>Subtotal Cost (Avg / Pack)<Input type="number" value={costPerPackAverageValue.toFixed(2)} readOnly /></Field>
            <Field>Cost per Piece (Auto)<Input type="number" value={costPerPieceComputedValue.toFixed(4)} readOnly /></Field>
          </>
        )}
        <Field>Source URL<Input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://example.com/item" /></Field>
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
