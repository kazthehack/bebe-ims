//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/31/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

const mockProductsData = [
  {
    id: '23098',
    active: true,
    name: 'Bubba Kush',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [{ id: '917627', unit: 'g', capacity: 150, stock: 117 }],
    unopenedPackages: [
      { id: '312628', unit: 'g', capacity: 244 },
      { id: '729772', unit: 'g', capacity: 380 },
    ],
  },
  {
    id: '19210',
    active: true,
    name: 'Blue Dream',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [{ id: '826621', unit: 'g', capacity: 100, stock: 27 }],
    unopenedPackages: [{ id: '123281', unit: 'g', capacity: 180 }],
  },
  {
    id: '01813',
    active: true,
    name: 'Girl Scout Cookies',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [{ id: '727711', unit: 'g', capacity: 200, stock: 192 }],
    unopenedPackages: [
      { id: '7696123', unit: 'g', capacity: 350 },
      { id: '9172376', unit: 'g', capacity: 320 },
      { id: '961242', unit: 'g', capacity: 315 },
    ],
  },
  {
    id: '84358',
    active: true,
    name: 'Cindy Looper',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [{ id: '912492', unit: 'g', capacity: 100, stock: 0 }],
    unopenedPackages: [],
  },
  {
    id: '17399',
    active: false,
    name: 'Gorilla Glue',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [{ id: '911242', unit: 'g', capacity: 200, stock: 145 }],
    unopenedPackages: [{ id: '1962322', unit: 'g', capacity: 180 }],
  },
  {
    id: '19148',
    active: true,
    name: 'Purple Punch',
    category: { name: 'Flower', value: 'flower', hasCannabis: true },
    openedPackages: [
      { id: '1236961', unit: 'g', capacity: 200, stock: 2 },
      { id: '86625521', unit: 'g', capacity: 200, stock: 190 },
    ],
    unopenedPackages: [{ id: '197619', unit: 'g', capacity: 180 }],
  },
  {
    id: '10183',
    active: true,
    name: 'Assorted Bongs',
    category: { name: 'Merchandise', value: 'merchandise', hasCannabis: false },
    openedPackages: [{ id: '1868622', unit: 'ct', capacity: 20, stock: 14 }],
    unopenedPackages: [],
  },
  {
    id: '57176',
    active: true,
    name: 'Logo Tee XL',
    category: { name: 'Merchandise', value: 'merchandise', hasCannabis: false },
    openedPackages: [{ id: '86168656', unit: 'g', capacity: 40, stock: 31 }],
    unopenedPackages: [],
  },
  {
    id: '61000',
    active: true,
    name: '10mg Gummies',
    category: { name: 'Edible', value: 'edible', hasCannabis: true },
    openedPackages: [{ id: '969112', unit: 'ct', capacity: 500, stock: 280 }],
    unopenedPackages: [{ id: '74741', unit: 'ct', capacity: 500 }],
  },
  {
    id: '57176',
    active: true,
    name: 'Skywalker',
    category: { name: 'Merch', value: 'merchandise', hasCannabis: true },
    openedPackages: null,
    unopenedPackages: [
      { id: '961961', unit: 'g', capacity: 300 },
    ],
  },
]

export default mockProductsData
