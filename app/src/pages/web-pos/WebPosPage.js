import React, { useState } from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import { useReceiptsResource, useSessionsResource } from 'hooks/bazaar/useBazaarApi'

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

const Input = styled.input`
  border: 1px solid #bfd0e0;
  border-radius: 4px;
  height: 36px;
  padding: 0 10px;
  margin-bottom: 6px;
  width: 100%;
`

const TextArea = styled.textarea`
  border: 1px solid #bfd0e0;
  border-radius: 4px;
  min-height: 90px;
  padding: 8px 10px;
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

const Row = styled.div`
  border-bottom: 1px solid #edf2f7;
  padding: 8px 0;
  font-size: 13px;
  color: #2b3f53;
`

const money = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const WebPosPage = () => {
  const [siteId, setSiteId] = useState('site1')
  const [employeeId, setEmployeeId] = useState('admin')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [itemsJson, setItemsJson] = useState('[\n  {\n    "product_variant_id": "",\n    "qty": 1,\n    "unit_price": 0\n  }\n]')
  const [formError, setFormError] = useState('')

  const sessions = useSessionsResource()
  const receipts = useReceiptsResource()

  const submitSession = async () => {
    await sessions.createSession({
      site_id: siteId,
      employee_id: employeeId,
    })
  }

  const submitReceipt = async () => {
    setFormError('')
    try {
      const parsedItems = JSON.parse(itemsJson)
      await receipts.createReceipt({
        receipt_number: receiptNumber,
        site_id: siteId,
        discount_amount: Number(discountAmount || 0),
        items: parsedItems,
      })
      setReceiptNumber('')
      setDiscountAmount('')
    } catch (err) {
      setFormError(err.message || 'Invalid receipt payload.')
    }
  }

  return (
    <PageContent title="Web POS">
      <Surface>
        <TwoCol>
          <Card>
            <h3>Sessions</h3>
            <Input placeholder="Site ID" value={siteId} onChange={event => setSiteId(event.target.value)} />
            <Input placeholder="Employee ID" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
            <Button type="button" onClick={submitSession}>Open Session</Button>
            <div style={{ marginTop: 12 }}>
              {sessions.loading && <Row>Loading sessions...</Row>}
              {sessions.sessions.map(item => (
                <Row key={item.id}>
                  <div><strong>{item.status}</strong> - {item.site_id}</div>
                  <div>{item.employee_id}</div>
                </Row>
              ))}
            </div>
            {sessions.error && <Row>{sessions.error}</Row>}
          </Card>

          <Card>
            <h3>Create Receipt</h3>
            <Input placeholder="Receipt Number" value={receiptNumber} onChange={event => setReceiptNumber(event.target.value)} />
            <Input placeholder="Discount Amount" type="number" value={discountAmount} onChange={event => setDiscountAmount(event.target.value)} />
            <TextArea value={itemsJson} onChange={event => setItemsJson(event.target.value)} />
            <Button type="button" onClick={submitReceipt}>Post Receipt</Button>
            {formError && <Row>{formError}</Row>}
            <div style={{ marginTop: 12 }}>
              {receipts.loading && <Row>Loading receipts...</Row>}
              {receipts.receipts.map(item => (
                <Row key={item.id}>
                  <div><strong>{item.receipt_number}</strong> ({item.site_id})</div>
                  <div>Subtotal: {money(item.subtotal)} | Discount: {money(item.discount_amount)} | Total: {money(item.total_amount)}</div>
                </Row>
              ))}
            </div>
            {receipts.error && <Row>{receipts.error}</Row>}
          </Card>
        </TwoCol>
      </Surface>
    </PageContent>
  )
}

export default WebPosPage
