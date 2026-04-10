import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Icon from 'components/common/display/Icon'
import { useProductsList } from 'hooks/products/useProductsApi'
import { useEventsResource, useInventoryResource, useReceiptsResource, useSessionsResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'
import logo from 'assets/logo-dashboard-cropped.png'

const PosViewport = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  background: #f2f6fb;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 780px) {
    padding: 6px;
  }
`

const Surface = styled.div`
  border: 1px solid #d7e2ef;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  border-radius: 14px;
  padding: 14px;
  color: #1f2f44;
  min-height: calc(100vh - 20px);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`

const SetupCard = styled.div`
  border: 1px solid #cfdbeb;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  max-width: 720px;
`

const Input = styled.input`
  border: 1px solid #c7d5e7;
  border-radius: 8px;
  min-height: 42px;
  padding: 0 12px;
  margin-bottom: 6px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  color: #203247;
  font-size: 15px;
`

const Select = styled.select`
  border: 1px solid #c7d5e7;
  border-radius: 8px;
  min-height: 42px;
  padding: 0 12px;
  margin-bottom: 6px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  color: #203247;
  font-size: 15px;

  option {
    color: #203247;
    background: #ffffff;
  }
`

const Button = styled.button`
  border: 1px solid #2c8cff;
  background: #2c8cff;
  color: #fff;
  border-radius: 8px;
  min-height: 42px;
  padding: 0 14px;
  cursor: pointer;
  font-weight: 700;
`

const SecondaryButton = styled(Button)`
  border: 1px solid #c7d5e7;
  background: #ffffff;
  color: #203247;
`

const DangerButton = styled(Button)`
  border: 1px solid #a94242;
  background: #8f3131;
`

const KebabButton = styled(SecondaryButton)`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

const Title = styled.h3`
  margin: 0 0 8px;
  color: #1d3045;
  font-size: 17px;
`

const SectionHeading = styled.div`
  margin: 0 0 8px;
  color: #1d3045;
  font-size: 17px;
  font-weight: 700;
`

const Label = styled.div`
  color: #607890;
  font-size: 12px;
  margin: 6px 0 4px;
`

const Subtle = styled.div`
  color: #607890;
  font-size: 12px;
`

const ErrorText = styled.div`
  color: #ff8f8f;
  font-size: 12px;
  margin-top: 6px;
`

const SplitRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ViewTabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #d4e0ee;
`

const TabButton = styled.button`
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2c8cff' : 'transparent')};
  background: transparent;
  color: ${({ $active }) => ($active ? '#1d3045' : '#607890')};
  min-height: 42px;
  padding: 0 14px;
  font-weight: 700;
  cursor: pointer;
`

const TabSpacer = styled.div`
  flex: 1 1 auto;
`

const ScanTabButton = styled(TabButton)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const Pane = styled.div`
  border: 1px solid #cfdbeb;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  min-width: 0;
  box-sizing: border-box;
`

const ContentPane = styled(Pane)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
`

const MenuBody = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 8px;
  min-height: 0;
`

const CategoryRail = styled.div`
  border: 1px solid #d4e0ee;
  border-radius: 8px;
  background: #f8fbff;
  padding: 4px;
  max-height: calc(100vh - 430px);
  overflow-y: auto;
`

const CategoryTab = styled.button`
  width: 100%;
  border: 1px solid ${({ $active }) => ($active ? '#2c8cff' : 'transparent')};
  background: ${({ $active }) => ($active ? '#e9f3ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#1d3045' : '#4f6479')};
  border-radius: 6px;
  min-height: 28px;
  padding: 0 6px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  width: 100%;
  min-width: 0;

  @media (max-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
  }
`

const MenuScroll = styled.div`
  margin-top: 8px;
  max-height: calc(100vh - 430px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
`

const ProductCard = styled.button`
  border: 1px solid ${({ disabled }) => (disabled ? '#8a97a6' : '#d4e0ee')};
  border-radius: 10px;
  background: ${({ disabled }) => (disabled ? '#a0a9b5' : '#f8fbff')};
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  aspect-ratio: 1 / 1;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  align-content: start;
  opacity: 1;

  &:hover {
    border-color: ${({ disabled }) => (disabled ? '#8a97a6' : '#9ec5ef')};
    background: ${({ disabled }) => (disabled ? '#a0a9b5' : '#f1f7ff')};
  }
`

const ProductName = styled.div`
  color: ${({ $disabled }) => ($disabled ? '#253444' : '#1f3349')};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  min-height: 1.2em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProductMeta = styled.div`
  color: ${({ $disabled }) => ($disabled ? '#2f4358' : '#607890')};
  font-size: 11px;
  line-height: 1.2;
  min-height: 1.2em;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-top: auto;
`

const CartList = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 8px;
  max-height: 350px;
  overflow: auto;
`

const CartItem = styled.div`
  border: 1px solid #d4e0ee;
  border-radius: 8px;
  background: #f8fbff;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`

const QtyRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

const QtyButton = styled.button`
  border: 1px solid #c7d5e7;
  background: #ffffff;
  color: #203247;
  border-radius: 6px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
`

const SmallButton = styled(SecondaryButton)`
  min-height: 30px;
  padding: 0 10px;
  border-radius: 6px;
`

const Section = styled.div`
  border-top: 1px solid #d4e0ee;
  margin-top: 10px;
  padding-top: 10px;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`

const SummaryValue = styled.div`
  text-align: right;
  font-weight: 700;
`

const CheckoutRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

const TopActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
`

const PosLogo = styled.img`
  width: 280px;
  max-width: 60vw;
  height: auto;
  object-fit: contain;

  @media (max-width: 780px) {
    width: 180px;
    max-width: 52vw;
  }
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 28, 41, 0.28);
  z-index: 9998;
`

const ModalCard = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(460px, calc(100vw - 24px));
  background: #ffffff;
  border: 1px solid #d4e0ee;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(12, 22, 35, 0.25);
  z-index: 9999;
  padding: 14px;
  box-sizing: border-box;
`

const CompactModalCard = styled(ModalCard)`
  width: min(340px, calc(100vw - 24px));
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`

const ModalTitleText = styled(Title)`
  font-size: 20px;
  margin-bottom: 10px;
  color: #000000;
`

const ModalBodyText = styled(Subtle)`
  font-size: 15px;
  line-height: 1.45;
  color: #000000;
`

const ModalLabelText = styled(Label)`
  font-size: 14px;
  margin: 10px 0 6px;
  color: #000000;
`

const ModalInlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: nowrap;
`

const ModalInlineLabel = styled.div`
  color: #000000;
  font-size: 15px;
  font-weight: 700;
  min-width: 46px;
`

const ModalPrimaryButton = styled(Button)`
  min-height: 44px;
  font-size: 15px;
`

const ModalSecondaryButton = styled(SecondaryButton)`
  min-height: 44px;
  font-size: 15px;
`

const ModalDangerButton = styled(DangerButton)`
  min-height: 44px;
  font-size: 15px;
`

const ScannerPreview = styled.video`
  width: 100%;
  border: 1px solid #d4e0ee;
  border-radius: 8px;
  background: #0f1722;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  margin-top: 8px;
`

const KebabWrap = styled.div`
  position: relative;
`

const KebabMenu = styled.div`
  position: fixed;
  top: 56px;
  right: 12px;
  width: min(280px, calc(100vw - 24px));
  background: #ffffff;
  border: 1px solid #d4e0ee;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(12, 22, 35, 0.16);
  z-index: 9999;
  padding: 6px 0;
  box-sizing: border-box;
`

const KebabItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: #1f3349;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.3;

  &:hover {
    background: #f3f8ff;
  }
`

const KebabSub = styled.div`
  color: #607890;
  font-size: 12px;
`

const KebabDivider = styled.div`
  height: 1px;
  background: #dfe8f4;
  margin: 6px 0;
`

const KebabOverlay = styled.button`
  position: fixed;
  inset: 0;
  border: none;
  background: transparent;
  z-index: 9997;
  box-sizing: border-box;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const WebPosPage = () => {
  const history = useHistory()
  const [activeSessionId, setActiveSessionId] = useState('')
  const [siteId, setSiteId] = useState('')
  const [eventId, setEventId] = useState('')
  const [employeeId, setEmployeeId] = useState('admin')
  const [openingCash, setOpeningCash] = useState('0')
  const [setupError, setSetupError] = useState('')

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [scanError, setScanError] = useState('')

  const [cartItems, setCartItems] = useState([])
  const [discountAmount, setDiscountAmount] = useState('0')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [checkoutError, setCheckoutError] = useState('')

  const [closingCash, setClosingCash] = useState('0')
  const [closeNotes, setCloseNotes] = useState('')
  const [closeError, setCloseError] = useState('')
  const [showKebabMenu, setShowKebabMenu] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [showScannerModal, setShowScannerModal] = useState(false)
  const [selectedVariantForCart, setSelectedVariantForCart] = useState(null)
  const [selectedQty, setSelectedQty] = useState('1')
  const [activePosTab, setActivePosTab] = useState('menu')
  const scannerVideoRef = useRef(null)
  const scannerStreamRef = useRef(null)
  const scannerTimerRef = useRef(null)

  const sessions = useSessionsResource()
  const receipts = useReceiptsResource()
  const events = useEventsResource()
  const sites = useSitesResource()
  const inventory = useInventoryResource()
  const products = useProductsList()
  const [siteStockByVariant, setSiteStockByVariant] = useState({})

  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX
    const prevBodyOverflowX = document.body.style.overflowX
    document.documentElement.style.overflowX = 'hidden'
    document.body.style.overflowX = 'hidden'
    return () => {
      document.documentElement.style.overflowX = prevHtmlOverflowX
      document.body.style.overflowX = prevBodyOverflowX
    }
  }, [])

  const activeSession = useMemo(
    () => (sessions.sessions || []).find((item) => item.id === activeSessionId) || null,
    [sessions.sessions, activeSessionId],
  )

  const activeSessionContext = useMemo(() => {
    if (activeSession) return activeSession
    if (!activeSessionId) return null
    return {
      id: activeSessionId,
      site_id: siteId || null,
      event_id: eventId || null,
    }
  }, [activeSession, activeSessionId, siteId, eventId])

  useEffect(() => {
    const selectedSiteId = String((activeSessionContext && activeSessionContext.site_id) || siteId || '').trim()
    if (!selectedSiteId) {
      setSiteStockByVariant({})
      return
    }
    let cancelled = false
    const loadSiteStock = async () => {
      try {
        const data = await inventory.loadSite(selectedSiteId)
        if (cancelled) return
        const nextMap = (data.items || []).reduce((acc, item) => {
          acc[item.product_variant_id] = Number(item.qty_available || 0)
          return acc
        }, {})
        setSiteStockByVariant(nextMap)
      } catch (_error) {
        if (!cancelled) setSiteStockByVariant({})
      }
    }
    loadSiteStock()
    return () => {
      cancelled = true
    }
  }, [activeSessionContext, siteId, inventory.loadSite])

  useEffect(() => {
    if (!siteId) {
      const defaultSite = ((sites.sites || []).find((item) => item.active) || {}).id || ''
      if (defaultSite) setSiteId(defaultSite)
    }
  }, [sites.sites, siteId])

  useEffect(() => {
    if (activeSessionId) return
    const openSession = [...(sessions.sessions || [])]
      .filter((item) => String(item.status || '').toLowerCase() === 'open')
      .sort((a, b) => String(b.opened_at || '').localeCompare(String(a.opened_at || '')))[0]
    if (openSession) {
      setActiveSessionId(openSession.id)
      if (openSession.site_id) setSiteId(openSession.site_id)
      if (openSession.event_id) setEventId(openSession.event_id)
    }
  }, [sessions.sessions, activeSessionId])

  const eventOptions = useMemo(() => (
    (events.events || [])
      .filter((item) => ['active', 'scheduled'].includes(String(item.status || '').toLowerCase()))
      .filter((item) => !siteId || !item.site_id || item.site_id === siteId)
      .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || '')))
  ), [events.events, siteId])

  const productById = useMemo(() => (
    (products.allProducts || []).reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  ), [products.allProducts])

  const variantCatalog = useMemo(() => {
    const rows = (products.variants || []).map((variant) => {
      const product = productById[variant.product_id] || {}
      return {
        id: variant.id,
        product_id: variant.product_id,
        product_name: product.name || variant.product_id,
        product_line: product.product_line || 'Unassigned',
        variant_name: variant.name || 'N/A',
        sku: variant.sku || variant.id,
        qr_code: variant.qr_code || '',
        unit_price: Number(product.list_price || 0),
      }
    })
    return rows.filter((item) => (category === 'all' || item.product_line === category))
      .filter((item) => {
        const q = String(search || '').trim().toLowerCase()
        if (!q) return true
        return (
          String(item.product_name || '').toLowerCase().includes(q)
          || String(item.variant_name || '').toLowerCase().includes(q)
          || String(item.sku || '').toLowerCase().includes(q)
          || String(item.qr_code || '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const lineCmp = String(a.product_line || '').localeCompare(String(b.product_line || ''))
        if (lineCmp !== 0) return lineCmp
        const productCmp = String(a.product_name || '').localeCompare(String(b.product_name || ''))
        if (productCmp !== 0) return productCmp
        return String(a.variant_name || '').localeCompare(String(b.variant_name || ''))
      })
  }, [products.variants, productById, category, search])

  const categoryOptions = useMemo(() => (
    [...new Set((products.allProducts || []).map((item) => String(item.product_line || 'Unassigned')))]
      .sort((a, b) => a.localeCompare(b))
  ), [products.allProducts])

  const displayedVariantCatalog = useMemo(() => (
    [...variantCatalog].sort((left, right) => {
      const leftOut = Number(siteStockByVariant[left.id] || 0) <= 0 ? 1 : 0
      const rightOut = Number(siteStockByVariant[right.id] || 0) <= 0 ? 1 : 0
      return leftOut - rightOut
    })
  ), [variantCatalog, siteStockByVariant])

  const shouldShowVariant = (variant) => (
    !!variant
    && variant !== 'N/A'
    && String(variant).trim().toLowerCase() !== String('').trim().toLowerCase()
  )

  const isSameProductAndVariant = (productName, variantName) => (
    String(productName || '').trim().toLowerCase() === String(variantName || '').trim().toLowerCase()
  )

  const addVariantToCart = (variant, qty = 1) => {
    if (!variant) return
    const safeQty = Math.max(1, Number.parseInt(String(qty || '1'), 10) || 1)
    const available = Number(siteStockByVariant[variant.id] || 0)
    const inCartQty = cartItems
      .filter((item) => item.product_variant_id === variant.id)
      .reduce((sum, item) => sum + Number(item.qty || 0), 0)
    if (available - inCartQty < safeQty) {
      setCheckoutError('Insufficient site stock for this item.')
      return
    }
    const hasVariant = shouldShowVariant(variant.variant_name) && !isSameProductAndVariant(variant.product_name, variant.variant_name)
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product_variant_id === variant.id)
      if (idx < 0) {
        return [...prev, {
          product_variant_id: variant.id,
          name: hasVariant ? `${variant.product_name} / ${variant.variant_name}` : variant.product_name,
          sku: variant.sku,
          qty: safeQty,
          unit_price: Number(variant.unit_price || 0),
        }]
      }
      return prev.map((item, rowIndex) => (rowIndex === idx
        ? { ...item, qty: item.qty + safeQty }
        : item))
    })
    setCheckoutError('')
    setActivePosTab('cart')
  }

  const openAddToCartModal = (variant) => {
    setSelectedVariantForCart(variant || null)
    setSelectedQty('1')
    setShowAddToCartModal(true)
  }

  const confirmAddToCart = () => {
    if (!selectedVariantForCart) return
    const qty = Math.max(1, Number.parseInt(String(selectedQty || '1'), 10) || 1)
    addVariantToCart(selectedVariantForCart, qty)
    setShowAddToCartModal(false)
    setSelectedVariantForCart(null)
    setSelectedQty('1')
  }

  const resolveVariantByQr = async (qrCode) => {
    const resolved = await receipts.resolveVariantByQr(qrCode)
    const catalogVariant = variantCatalog.find((item) => item.id === resolved.id)
    if (catalogVariant) return catalogVariant
    const product = productById[resolved.product_id] || {}
    return {
      id: resolved.id,
      product_id: resolved.product_id,
      product_name: product.name || resolved.product_id,
      product_line: product.product_line || 'Unassigned',
      variant_name: resolved.name || 'N/A',
      sku: resolved.sku || resolved.id,
      qr_code: resolved.qr_code || '',
      unit_price: Number(product.list_price || 0),
    }
  }

  const openRegister = async () => {
    setSetupError('')
    try {
      if (!siteId) {
        setSetupError('Site is required.')
        return
      }
      if (!eventId) {
        setSetupError('Event is required.')
        return
      }
      const opened = await sessions.createSession({
        site_id: siteId,
        employee_id: employeeId || 'admin',
        event_id: eventId,
        opening_cash: Number(openingCash || 0),
      })
      if (opened && opened.id) setActiveSessionId(opened.id)
      await sessions.reload()
      setCartItems([])
      setDiscountAmount('0')
      setPaymentMethod('cash')
    } catch (err) {
      setSetupError(err.message || 'Failed to open register.')
    }
  }

  const closeRegister = async () => {
    if (!activeSessionContext || !activeSessionContext.id) return
    setCloseError('')
    try {
      await sessions.closeSession(activeSessionContext.id, {
        closing_cash: Number(closingCash || 0),
        close_notes: closeNotes || null,
      })
      setActiveSessionId('')
      setCartItems([])
      setCloseNotes('')
      setClosingCash('0')
      setShowCloseConfirm(false)
      setShowKebabMenu(false)
    } catch (err) {
      setCloseError(err.message || 'Failed to close register.')
    }
  }

  const scanToCart = async (qrValue) => {
    const qrCode = String(qrValue || '').trim()
    if (!qrCode) return
    setScanError('')
    try {
      const resolved = await resolveVariantByQr(qrCode)
      addVariantToCart(resolved, 1)
    } catch (err) {
      setScanError(err.message || 'QR not found.')
    }
  }

  const stopScanner = () => {
    if (scannerTimerRef.current) {
      window.clearInterval(scannerTimerRef.current)
      scannerTimerRef.current = null
    }
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach((track) => track.stop())
      scannerStreamRef.current = null
    }
    if (scannerVideoRef.current) {
      scannerVideoRef.current.srcObject = null
    }
  }

  useEffect(() => () => {
    stopScanner()
  }, [])

  useEffect(() => {
    if (!showScannerModal) {
      stopScanner()
      return undefined
    }

    if (!activeSessionContext || !activeSessionContext.id) {
      setScanError('Open a register first.')
      setShowScannerModal(false)
      return undefined
    }

    let cancelled = false

    const startScanner = async () => {
      setScanError('')
      try {
        if (!window.isSecureContext) {
          setScanError('Camera scan requires HTTPS (or localhost). Current origin is not secure.')
          return
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setScanError('Camera API is not available on this browser/device.')
          return
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        scannerStreamRef.current = stream
        if (scannerVideoRef.current) {
          scannerVideoRef.current.srcObject = stream
          await scannerVideoRef.current.play()
        }

        if (typeof window.BarcodeDetector === 'undefined') {
          setScanError('QR camera scan is not supported in this browser.')
          return
        }

        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        scannerTimerRef.current = window.setInterval(async () => {
          if (!scannerVideoRef.current) return
          try {
            const barcodes = await detector.detect(scannerVideoRef.current)
            const firstCode = (barcodes || [])[0]
            const qrText = String((firstCode && firstCode.rawValue) || '').trim()
            if (!qrText) return
            stopScanner()
            setShowScannerModal(false)
            await scanToCart(qrText)
          } catch (error) {
            setScanError(error.message || 'Scanner read failed.')
          }
        }, 260)
      } catch (error) {
        setScanError(error.message || 'Failed to open camera.')
      }
    }

    startScanner()

    return () => {
      cancelled = true
      stopScanner()
    }
  }, [showScannerModal, activeSessionContext])

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.unit_price || 0)), 0)
  const total = subtotal - Number(discountAmount || 0)

  const postReceipt = async () => {
    if (!activeSessionContext || !activeSessionContext.id || !activeSessionContext.site_id) {
      setCheckoutError('Open a register first.')
      return
    }
    setCheckoutError('')
    try {
      if (!cartItems.length) {
        setCheckoutError('Cart is empty.')
        return
      }
      await receipts.createReceipt({
        receipt_number: null,
        site_id: activeSessionContext.site_id,
        event_id: activeSessionContext.event_id || null,
        web_pos_session_id: activeSessionContext.id,
        payment_method: paymentMethod,
        discount_amount: Number(discountAmount || 0),
        items: cartItems.map((item) => ({
          product_variant_id: item.product_variant_id,
          qty: Number(item.qty || 1),
          unit_price: Number(item.unit_price || 0),
        })),
      })
      setCartItems([])
      setDiscountAmount('0')
      setActivePosTab('menu')
      const selectedSiteId = String((activeSessionContext && activeSessionContext.site_id) || '').trim()
      if (selectedSiteId) {
        const data = await inventory.loadSite(selectedSiteId)
        const nextMap = (data.items || []).reduce((acc, item) => {
          acc[item.product_variant_id] = Number(item.qty_available || 0)
          return acc
        }, {})
        setSiteStockByVariant(nextMap)
      }
    } catch (err) {
      setCheckoutError(err.message || 'Failed to post receipt.')
    }
  }

  const resetCart = () => {
    setCartItems([])
    setDiscountAmount('0')
    setCheckoutError('')
  }

  return (
    <PosViewport>
      <Surface>
        {showExitConfirm && (
          <>
            <ModalBackdrop onClick={() => setShowExitConfirm(false)} />
            <ModalCard>
              <ModalTitleText>Exit POS</ModalTitleText>
              <ModalBodyText>Return to Inventory Management?</ModalBodyText>
              <ModalActions>
                <ModalSecondaryButton type="button" onClick={() => setShowExitConfirm(false)}>Cancel</ModalSecondaryButton>
                <ModalPrimaryButton type="button" onClick={() => {
                  setShowExitConfirm(false)
                  history.push('/inventory')
                }}
                >
                  Confirm
                </ModalPrimaryButton>
              </ModalActions>
            </ModalCard>
          </>
        )}
        {showAddToCartModal && (
          <>
            <ModalBackdrop onClick={() => {
              setShowAddToCartModal(false)
              setSelectedVariantForCart(null)
              setSelectedQty('1')
            }}
            />
            <CompactModalCard>
              <ModalTitleText>Add To Cart</ModalTitleText>
              <ModalBodyText>
                <strong>Item:</strong>{' '}
                {selectedVariantForCart
                  ? (
                    shouldShowVariant(selectedVariantForCart.variant_name)
                    && !isSameProductAndVariant(selectedVariantForCart.product_name, selectedVariantForCart.variant_name)
                      ? `${selectedVariantForCart.product_name} / ${selectedVariantForCart.variant_name}`
                      : selectedVariantForCart.product_name
                  )
                  : ''}
              </ModalBodyText>
              <ModalInlineRow>
                <ModalInlineLabel>Qty</ModalInlineLabel>
                <QtyButton
                  type="button"
                  onClick={() => setSelectedQty((prev) => String(Math.max(1, (Number.parseInt(String(prev || '1'), 10) || 1) - 1)))}
                >
                  -
                </QtyButton>
                <Input
                  style={{ marginBottom: 0, textAlign: 'center', width: '84px', minWidth: '84px', maxWidth: '84px', padding: '0 6px' }}
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={(event) => setSelectedQty(event.target.value)}
                />
                <QtyButton
                  type="button"
                  onClick={() => setSelectedQty((prev) => String((Number.parseInt(String(prev || '1'), 10) || 1) + 1))}
                >
                  +
                </QtyButton>
              </ModalInlineRow>
              <ModalActions>
                <ModalSecondaryButton
                  type="button"
                  onClick={() => {
                    setShowAddToCartModal(false)
                    setSelectedVariantForCart(null)
                    setSelectedQty('1')
                  }}
                >
                  Cancel
                </ModalSecondaryButton>
                <ModalPrimaryButton type="button" onClick={confirmAddToCart}>Add To Cart</ModalPrimaryButton>
              </ModalActions>
            </CompactModalCard>
          </>
        )}
        {showCloseConfirm && (
          <>
            <ModalBackdrop onClick={() => {
              setShowCloseConfirm(false)
              setCloseError('')
            }}
            />
            <ModalCard>
              <ModalTitleText>Close Register</ModalTitleText>
              <ModalBodyText>Confirm end-of-day closeout.</ModalBodyText>
              <ModalLabelText>Closing Cash</ModalLabelText>
              <Input type="number" min="0" step="0.01" value={closingCash} onChange={(event) => setClosingCash(event.target.value)} />
              <ModalLabelText>Close Notes</ModalLabelText>
              <Input value={closeNotes} onChange={(event) => setCloseNotes(event.target.value)} />
              {closeError && <ErrorText>{closeError}</ErrorText>}
              <ModalActions>
                <ModalSecondaryButton type="button" onClick={() => {
                  setShowCloseConfirm(false)
                  setCloseError('')
                }}
                >
                  Cancel
                </ModalSecondaryButton>
                <ModalDangerButton type="button" onClick={closeRegister}>Close Register</ModalDangerButton>
              </ModalActions>
            </ModalCard>
          </>
        )}
        {showScannerModal && (
          <>
            <ModalBackdrop onClick={() => setShowScannerModal(false)} />
            <CompactModalCard>
              <ModalTitleText>Scan QR</ModalTitleText>
              <ModalBodyText>Point the camera at the variant QR code to add item to cart.</ModalBodyText>
              <ScannerPreview ref={scannerVideoRef} autoPlay muted playsInline />
              {scanError && <ErrorText>{scanError}</ErrorText>}
              <ModalActions>
                <ModalSecondaryButton type="button" onClick={() => setShowScannerModal(false)}>
                  Close
                </ModalSecondaryButton>
              </ModalActions>
            </CompactModalCard>
          </>
        )}
        {showKebabMenu && <KebabOverlay aria-label="Close POS menu" onClick={() => setShowKebabMenu(false)} />}
        <TopActionRow>
          <PosLogo src={logo} alt="Bebe Inventory" />
          <KebabWrap>
            <KebabButton type="button" onClick={() => setShowKebabMenu((prev) => !prev)} aria-label="POS menu" title="POS menu">
              <Icon name="menu" />
            </KebabButton>
            {showKebabMenu && (
              <KebabMenu>
                <KebabItem
                  type="button"
                  onClick={() => {
                    setShowKebabMenu(false)
                    setShowExitConfirm(true)
                  }}
                >
                  Exit POS
                  <KebabSub>Return to Inventory Management</KebabSub>
                </KebabItem>
                <KebabDivider />
                <KebabItem
                  type="button"
                  onClick={() => {
                    setShowKebabMenu(false)
                    setCloseError('')
                    setShowCloseConfirm(true)
                  }}
                >
                  Close Register
                  <KebabSub>Set closing cash and finalize session</KebabSub>
                </KebabItem>
              </KebabMenu>
            )}
          </KebabWrap>
        </TopActionRow>
        {!activeSession && (
          <SetupCard>
            <Title>Open Register</Title>
            <Subtle>Select event and opening cash to start POS mode.</Subtle>
            <Label>Site</Label>
            <Select value={siteId} onChange={(event) => setSiteId(event.target.value)}>
              <option value="">Select site</option>
              {(sites.sites || []).filter((item) => item.active).map((item) => (
                <option key={item.id} value={item.id}>{item.name || item.code || item.id}</option>
              ))}
            </Select>
            <Label>Event</Label>
            <Select value={eventId} onChange={(event) => setEventId(event.target.value)}>
              <option value="">Select event</option>
              {eventOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.title} ({item.start_date})</option>
              ))}
            </Select>
            <SplitRow>
              <div>
                <Label>Cashier</Label>
                <Input placeholder="employee" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} />
              </div>
              <div>
                <Label>Opening Cash</Label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" value={openingCash} onChange={(event) => setOpeningCash(event.target.value)} />
              </div>
            </SplitRow>
            <Button type="button" onClick={openRegister}>Open Register</Button>
            {setupError && <ErrorText>{setupError}</ErrorText>}
          </SetupCard>
        )}

        {activeSessionId && (
          <>
            <ViewTabs>
              <TabButton type="button" $active={activePosTab === 'menu'} onClick={() => setActivePosTab('menu')}>MENU</TabButton>
              <TabButton type="button" $active={activePosTab === 'cart'} onClick={() => setActivePosTab('cart')}>CART ({cartItems.length})</TabButton>
              <TabSpacer />
              <ScanTabButton
                type="button"
                $active={showScannerModal}
                onClick={() => setShowScannerModal(true)}
                title="Scan QR"
                aria-label="Scan QR"
              >
                <Icon name="barcode" />
                SCAN
              </ScanTabButton>
            </ViewTabs>

            <ContentPane>
              {activePosTab === 'menu' && (
                <>
                <Input
                  placeholder="Search product, variant, SKU, QR"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <MenuBody>
                  <CategoryRail>
                    <CategoryTab $active={category === 'all'} type="button" onClick={() => setCategory('all')}>All</CategoryTab>
                    {categoryOptions.map((item) => (
                      <CategoryTab key={item} $active={category === item} type="button" onClick={() => setCategory(item)}>
                        {item}
                      </CategoryTab>
                    ))}
                  </CategoryRail>

                  <MenuScroll>
                    <CatalogGrid>
                      {displayedVariantCatalog.map((item) => {
                        const available = Number(siteStockByVariant[item.id] || 0)
                        const outOfStock = available <= 0
                        return (
                      <ProductCard key={item.id} type="button" onClick={() => openAddToCartModal(item)} disabled={outOfStock}>
                        <ProductName $disabled={outOfStock}>{item.product_name}</ProductName>
                        {shouldShowVariant(item.variant_name) && !isSameProductAndVariant(item.product_name, item.variant_name) && (
                          <ProductMeta $disabled={outOfStock}>{item.variant_name}</ProductMeta>
                        )}
                          <ProductMeta $disabled={outOfStock}>{outOfStock ? 'OUT OF STOCK' : `${available} available`}</ProductMeta>
                          <CardFooter>
                            <strong>{money(item.unit_price)}</strong>
                          </CardFooter>
                        </ProductCard>
                        )
                      })}
                    </CatalogGrid>
                  </MenuScroll>
                </MenuBody>
                </>
              )}

              {activePosTab === 'cart' && (
                <>
                <Section>
                  <SectionHeading>Items</SectionHeading>
                  <CartList>
                    {!cartItems.length && (
                      <CartItem>
                        <div>
                          <strong>No items yet.</strong>
                          <Subtle>Scan QR or add from menu.</Subtle>
                        </div>
                        <div />
                      </CartItem>
                    )}
                    {cartItems.map((item, index) => (
                      <CartItem key={`${item.product_variant_id}-${index}`}>
                        <div>
                          <strong>{item.name}</strong>
                          <Subtle>{item.sku}</Subtle>
                        </div>
                        <div>
                          <QtyRow>
                            <QtyButton type="button" onClick={() => setCartItems((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, qty: Math.max(1, row.qty - 1) } : row)))}>-</QtyButton>
                            <span>{item.qty}</span>
                            <QtyButton
                              type="button"
                              onClick={() => {
                                const available = Number(siteStockByVariant[item.product_variant_id] || 0)
                                if (Number(item.qty || 0) >= available) {
                                  setCheckoutError('Insufficient site stock for this item.')
                                  return
                                }
                                setCartItems((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, qty: row.qty + 1 } : row)))
                              }}
                            >
                              +
                            </QtyButton>
                            <SmallButton type="button" onClick={() => setCartItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index))} title="Remove" aria-label="Remove">
                              <Icon name="trash" />
                            </SmallButton>
                          </QtyRow>
                          <Subtle>{money(item.unit_price)} each</Subtle>
                        </div>
                      </CartItem>
                    ))}
                  </CartList>
                  <SummaryRow>
                    <strong>Subtotal</strong>
                    <SummaryValue>{money(subtotal)}</SummaryValue>
                  </SummaryRow>
                </Section>


                <Section>
                  <SectionHeading>Payment Details</SectionHeading>
                  <Label>Discount</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountAmount}
                    onChange={(event) => setDiscountAmount(event.target.value)}
                  />
                  <Label>Method</Label>
                  <Select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                    <option value="cash">Cash</option>
                    <option value="digital">Digital</option>
                  </Select>
                  <SummaryRow>
                    <strong>Total</strong>
                    <SummaryValue>{money(total)}</SummaryValue>
                  </SummaryRow>
                </Section>

                <Section>
                  <CheckoutRow>
                    <SecondaryButton type="button" onClick={resetCart}>RESET CART</SecondaryButton>
                    <Button type="button" onClick={postReceipt}>CHECK OUT</Button>
                  </CheckoutRow>
                  {checkoutError && <ErrorText>{checkoutError}</ErrorText>}
                </Section>
                </>
              )}
            </ContentPane>
          </>
        )}
      </Surface>
    </PosViewport>
  )
}

export default WebPosPage
