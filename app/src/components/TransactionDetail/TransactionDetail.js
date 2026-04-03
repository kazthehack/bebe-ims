/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import { isEmpty, isString, get } from 'lodash'
import { compose } from 'recompose'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import QRCode from 'qrcode.react'
import Button from 'components/common/input/Button'
import colors from 'styles/colors'
import moment from 'moment-timezone'
import { withState as withReportsState } from 'store/modules/reports/transactionHistoryReport'
import Details from './Details/DetailList'
import Adjustments from './Adjustments/AdjustmentList'
import Totals from './Totals/TotalList'
import { mapReceiptDataToDetailedProps } from './Data'

const StyledTransactionDetail = styled.div`
  display: flex;
  flex: 0 50%;
  flex-direction: row;
  justify-content: space-between;
`

const StyledDetailsInfo = styled.div`
  flex-direction: column;
  width: 50%
`

const StyledQRCode = styled(QRCode)`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`

const StyledButton = styled(Button)`
  background-color: ${colors.white};
  border: 2px solid ${colors.blue};
  color: ${colors.blue};
  box-shadow: none;
  width: 190px;

  :disabled {
    border: 2px solid rgba(24,117,240,0.3);
    color: rgba(24,117,240,0.3);
  }
`

const StyledTotalList = styled.div`
  height: 100%;
  width: 45%
`

const StyledButtonsRow = styled.div`
  display: flex;
  flex: 0 50%;
  justify-content: space-between;
  margin-bottom: 10px;
`

const TransactionDetailPure = ({
  data = mapReceiptDataToDetailedProps({ node: {} }),
  storeTimezone,
  transactionData,
  nextReceipt,
  previousReceipt,
  history,
  match,
}) => {
  const {
    subTotal,
    subTotalDiscounts,
    total,
    tendered,
    adjustments,
    saleItems,
    tax,
    receiptId,
  } = transactionData || data

  const { startDt, endDt } = match.params

  return (
    <StyledTransactionDetail>
      <StyledDetailsInfo>
        <Details {...(transactionData || data)} storeTimezone={storeTimezone} />
        {!isEmpty(adjustments) && <Adjustments adjustments={adjustments} />}
        {isString(receiptId) &&
          <StyledQRCode
            value={receiptId}
            level="H"
            renderAs="svg"
            size={256}
          />
        }
      </StyledDetailsInfo>
      <StyledTotalList>
        <StyledButtonsRow>
          <StyledButton
            onClick={() => {
              history.push(`/reports/transaction/detailed/${get(previousReceipt, 'store.transactionHistory.receipts.edges[0].node.id')}/${startDt}/${endDt}/${get(previousReceipt, 'store.transactionHistory.receipts.edges[0].cursor')}`)
            }}
            disabled={isEmpty(get(previousReceipt, 'store.transactionHistory.receipts.edges'))
              || moment(get(previousReceipt, 'store.transactionHistory.receipts.edges[0].node.soldAt')) > moment(transactionData.saleAt)}
          >
            Previous
          </StyledButton>
          <StyledButton
            onClick={() => {
              history.push(`/reports/transaction/detailed/${get(nextReceipt, 'store.transactionHistory.receipts.edges[0].node.id')}/${startDt}/${endDt}/${get(nextReceipt, 'store.transactionHistory.receipts.edges[0].cursor')}`)
            }}
            disabled={isEmpty(get(nextReceipt, 'store.transactionHistory.receipts.edges'))
              || moment(get(nextReceipt, 'store.transactionHistory.receipts.edges[0].node.soldAt')) < moment(transactionData.saleAt)}
          >
            Next
          </StyledButton>
        </StyledButtonsRow>
        <Totals
          saleItems={saleItems}
          subTotal={subTotal}
          subTotalDiscounts={subTotalDiscounts}
          tendered={tendered}
          total={total}
          tax={tax}
        />
      </StyledTotalList>
    </StyledTransactionDetail>
  )
}

export default compose(
  withRouter,
  withReportsState,
)(TransactionDetailPure)
