//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/4/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

const mockPricingGroupData = [
  {
    id: '0fsfa42',
    title: 'Top shelf bulk flower',
    rules: [
      { title: '1 gram', unit: 'g', amount: 1, basePrice: 10, tax: 3, totalPrice: 13 },
      { title: '2 grams', unit: 'g', amount: 2, basePrice: 19, tax: 5.7, totalPrice: 24.7 },
      { title: '⅛ ounce', unit: 'g', amount: 0.125, basePrice: 31.25, tax: 9.38, totalPrice: 40.63 },
      { title: '¼ ounce', unit: 'g', amount: 0.25, basePrice: 60.50, tax: 18.15, totalPrice: 78.65 },
      { title: '½ ounce', unit: 'g', amount: 0.5, basePrice: 113.67, tax: 34.10, totalPrice: 147.77 },
      { title: '1 ounce', unit: 'g', amount: 1, basePrice: 218, tax: 65.4, totalPrice: 283.4 },
    ],
  },
]

export default mockPricingGroupData
