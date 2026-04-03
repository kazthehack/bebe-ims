//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/5/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

const mockProductPackagesData = [
  {
    id: '912492',
    unit: 'g',
    active: true, // from product
    hasCannabis: true, // from product
    capacity: 100,
    stock: 0, // only exists for opened packages
    source: {
      name: 'Mad Labs',
    },
  },
  {
    id: '911242',
    unit: 'g',
    active: true, // from product
    hasCannabis: true, // from product
    capacity: 200,
    stock: 145,
    source: {
      name: 'Humbolt Farm',
    },
  },
  {
    id: '7696123',
    unit: 'g',
    active: true, // from product
    hasCannabis: true, // from product
    opened: false,
    capacity: 350,
    source: {
      name: 'Mad Labs',
    },
  },
  {
    id: '9172376',
    unit: 'g',
    active: true, // from product
    hasCannabis: true, // from product
    opened: false,
    capacity: 320,
    source: {
      name: 'Weed Bakery',
    },
  },
  {
    id: '961242',
    unit: 'g',
    active: true, // from product
    hasCannabis: true, // from product
    opened: false,
    capacity: 315,
    source: {
      name: 'Humbolt Farm',
    },
  },
]

export default mockProductPackagesData
