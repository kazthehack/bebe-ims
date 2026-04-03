//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

const aggregateTaxes = (taxList, salesType) => {
  if (!salesType) return { rec: {}, med: {} }
  let medPer = 0
  let medFix = 0
  let recPer = 0
  let recFix = 0
  taxList.forEach(({ node }) => {
    const amount = Number(node.amount)
    node.salesTypes.forEach((st) => {
      if (st.id === salesType.id) {
        if (node.active && (node.appliesTo === 'ITEM')) {
          if (node.customerType === 'RECREATIONAL') { // TODO: support ANY type
            if (node.amountType === 'PERCENTAGE') {
              recPer += (amount / 100)
            } else {
              recFix += amount
            }
          } else if (node.customerType === 'ANY') {
            if (node.amountType === 'PERCENTAGE') {
              recPer += (amount / 100)
              medPer += (amount / 100)
            } else {
              recFix += amount
              medFix += amount
            }
          } else if (node.amountType === 'PERCENTAGE') {
            medPer += (amount / 100)
          } else {
            medFix += amount
          }
        }
      }
    })
  })
  return { rec: { percentage: recPer, fixed: recFix }, med: { percentage: medPer, fixed: medFix } }
}

export default aggregateTaxes
