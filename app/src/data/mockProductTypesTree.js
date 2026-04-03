//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 10/6/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

const mockProductTypesTree = [
  {
    value: 'flower',
    label: 'Flower',
    hasCannabis: true,
    children: [
      { value: 'flower-prepack', label: 'Flower (pre-pack)' },
      { value: 'flower-bulk', label: 'Flower (bulk)' },
    ],
    screenDescription: 'Cannabis Pre-pack and Bulk bud/flower products.',
  },
  {
    value: 'preroll',
    label: 'Pre-Roll',
    hasCannabis: true,
    children: [
      { value: 'preroll-preroll', label: 'Pre-Roll' },
      { value: 'preroll-combined', label: 'Combined (Bud + Concentrate)' },
    ],
    screenDescription: 'Cannabis Pre-Roll and Combined (Bud + Concentrate) products.',
  },
  {
    value: 'edible',
    label: 'Edible',
    hasCannabis: true,
    children: [
      { value: 'edible-edible', label: 'Edible' },
      { value: 'edible-beverage', label: 'Beverage' },
    ],
    screenDescription: 'Cannabis Extract products, such as: Edibles & Beverages.',
  },
  {
    value: 'concentrate',
    label: 'Concentrate',
    hasCannabis: true,
    children: [
      { value: 'concentrate-extract', label: 'Extract (solvent)' },
      { value: 'concentrate-cartridge', label: 'Cartridge / Vaporizer' },
      { value: 'concentrate-shatter', label: 'Shatter / Oil (solventless)' },
    ],
    screenDescription: 'Cannabis concentrate products such as: Extracts, Cartridges, Vaporizers, Shatter and Oils.',
  },
  {
    value: 'oral',
    label: 'Oral / Topical Cannabis',
    hasCannabis: true,
    children: [
      { value: 'oral-capsule', label: 'Capsule' },
      { value: 'oral-sublingual', label: 'Sub-lingual (Tincture)' },
      { value: 'oral-patch', label: 'Transdermal Patch' },
      { value: 'oral-topical', label: 'Topical (hair/skin)' },
    ],
    screenDescription: 'Cannabis Oral / Topical products such as: Capsules, Tinctures, Transdermal Patches and Topicals.',
  },
  {
    value: 'plant',
    label: 'Plant',
    hasCannabis: true,
    children: [
      { value: 'plant-clone', label: 'Clone' },
      { value: 'plant-seed', label: 'Seed' },
    ],
    screenDescription: 'Cannabis Plant products such as: Clones & Seeds.',
  },
  {
    value: 'merchandise',
    label: 'Merchandise',
    hasCannabis: false,
    children: [
      { value: 'merchandise-glass', label: 'Bongs / Pipes / Glass' },
      { value: 'merchandise-vape', label: 'Vape Pen / Atomizer' },
      { value: 'merchandise-accessory', label: 'Accessory' },
      { value: 'merchandise-supply', label: 'Supply' },
      { value: 'merchandise-other', label: 'Other' },
    ],
    screenDescription: 'Non-cannabis Merchandise Products such as: Glassware, Vape Pens, Accessories, general supplies, etc.',
  },
]

export default mockProductTypesTree
