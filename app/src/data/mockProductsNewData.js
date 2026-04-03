//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

const mockProductsNewData = [
  {
    node: {
      inventoryId: 'UHJvZHVjdDoyODY=',
      medicalOnly: true,
      name: 'Test Buds',
      packages: [
        {
          id: 'UGFja2FnZTo1OTk=',
          quantity: '1.0000',
          finishedDate: '2019-08-01',
          unit: 'GRAMS',
        },
        {
          id: 'UGFja2FnZTo2MDE=',
          quantity: '4.0000',
          finishedDate: null,
          unit: 'GRAMS',
        },
      ],
      posActive: true,
      salesType: {
        name: 'Buds',
        iconName: 'flower-nug',
      },
      activePackageCount: 1,
      emptyPackageCount: 0,
    },
  },
  {
    node: {
      inventoryId: 'UHJvZHVjdDoyODY=',
      medicalOnly: false,
      name: 'Test Flower',
      packages: [
        {
          id: 'UGFja2FnZTo1lmb=',
          quantity: '2.0000',
          finishedDate: null,
          unit: 'GRAMS',
        },
        {
          id: 'UGFja2Fn887MDE=',
          quantity: '0.0000',
          finishedDate: '2019-07-21',
          unit: 'GRAMS',
        },
        {
          id: 'UGFja2FnZTo1OTk=',
          quantity: '4.0000',
          finishedDate: null,
          unit: 'GRAMS',
        },
      ],
      posActive: false,
      salesType: {
        name: 'Buds',
        iconName: 'flower-nug',
      },
      activePackageCount: 2,
      emptyPackageCount: 0,
    },
  },
]

export default mockProductsNewData
