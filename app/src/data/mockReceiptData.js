const mockReceipt = {
  data: {
    node: {
      id: 'UmVjZWlwdDo3NA==',
      uuid: '8c9a41cc-6d17-40d5-8e58-a2f6bc65d030',
      soldAt: '2019-04-28T06:44:18',
      paymentType: 'CASH',
      terminalName: 'Tombs Terminal 1',
      employee: {
        name: 'Pamela Kirk',
        shortName: 'Marissa',
      },
      customerType: 'RECREATIONAL',
      adjustments: [
        {
          createdAt: '2019-04-28T06:44:40',
          employee: {
            id: 'RW1wbG95ZWU6MjI=',
            name: 'Pamela Kirk',
            shortName: 'Marissa',
          },
          type: 'RETURNED',
          amount: '106.62',
          receiptItem: {
            uuid: '1aaa5eae-ebdd-4efe-b66f-17be7e33adfa',
            quantitySold: '3.0000',
            productName: 'Astral OG',
          },
        },
        {
          createdAt: '2019-04-28T06:48:25',
          employee: {
            id: 'RW1wbG95ZWU6MjI=',
            name: 'Pamela Kirk',
            shortName: 'Marissa',
          },
          type: 'RETURNED',
          amount: '105.75',
          receiptItem: {
            uuid: '1fe48633-48cc-4173-bb00-5c409c33809e',
            quantitySold: '2.0000',
            productName: 'Astral OG',
          },
        },
        {
          createdAt: '2019-04-28T06:49:36',
          employee: {
            id: 'RW1wbG95ZWU6MjI=',
            name: 'Pamela Kirk',
            shortName: 'Marissa',
          },
          type: 'RETURNED',
          amount: '111.50',
          receiptItem: {
            uuid: '1608baf3-cb71-47d0-8d06-6f0a3fd01c6e',
            quantitySold: '4.0000',
            productName: 'Astral OG',
          },
        },
      ],
      items: [
        {
          uuid: '1aaa5eae-ebdd-4efe-b66f-17be7e33adfa',
          quantitySold: '3.0000',
          productName: 'Astral OG',
          lineItemTotal: '106.6190',
          appliedDiscounts: [
            {
              amount: '2.0000',
              amountSelected: null,
              discountRule: {
                appliesTo: 'ITEM',
                amount: '2',
                discountName: 'Item Discount: Buds, fixed, any',
                discountAmountType: 'FIXED',
              },
            },
            {
              amount: '1.6666',
              amountSelected: null,
              discountRule: {
                appliesTo: 'SUBTOTAL',
                amount: '5',
                discountName: 'Subtotal Discount: AmountType.fixed, AnyCustomerType.any',
                discountAmountType: 'FIXED',
              },
            },
          ],
        },
        {
          uuid: '1fe48633-48cc-4173-bb00-5c409c33809e',
          quantitySold: '2.0000',
          productName: 'Astral OG',
          lineItemTotal: '105.7460',
          appliedDiscounts: [
            {
              amount: '1.1111',
              amountSelected: null,
              discountRule: {
                appliesTo: 'SUBTOTAL',
                amount: '5',
                discountName: 'Subtotal Discount: AmountType.fixed, AnyCustomerType.any',
                discountAmountType: 'FIXED',
              },
            },
          ],
        },
        {
          uuid: '1608baf3-cb71-47d0-8d06-6f0a3fd01c6e',
          quantitySold: '4.0000',
          productName: 'Astral OG',
          lineItemTotal: '111.4921',
          appliedDiscounts: [
            {
              amount: '2.2222',
              amountSelected: null,
              discountRule: {
                appliesTo: 'SUBTOTAL',
                amount: '5',
                discountName: 'Subtotal Discount: AmountType.fixed, AnyCustomerType.any',
                discountAmountType: 'FIXED',
              },
            },
          ],
        },
      ],
      discountRules: [
        {
          appliesTo: 'ITEM',
          amount: '2',
          discountName: 'Item Discount: Buds, fixed, any',
          discountAmountType: 'FIXED',
        },
        {
          appliesTo: 'SUBTOTAL',
          amount: '5',
          discountName: 'Subtotal Discount: AmountType.fixed, AnyCustomerType.any',
          discountAmountType: 'FIXED',
        },
      ],
      tendered: '400.00',
      subtotal: '30.8571',
      tax: '300.0000',
      total: null,
    },
  },
}

export default mockReceipt
