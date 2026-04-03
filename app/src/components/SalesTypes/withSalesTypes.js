//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getSalesTypes } from 'ops/salesTypes'
import { compose } from 'recompose'
import { withVenueID } from 'components/Venue'
import { get } from 'lodash'

// Current sales type tags to be matched from the backend, specific to Oregon
export const salesTypes = {
  Buds: 'f8e22ef4488e55695daf025bd02eb1e871b2456c',
  'Shake/Trim': '36ddf2f6dd537194539704397dc09bfc64d55e47',
  'Infused Pre-roll': 'b1a83ec1b394d958408c7b0e619b739dd70a29bb',
  'Non-Infused Pre-roll': '6f952651270b545ade0eb1d9001f1786d9b82078',
  'Edible (Solid)': 'f2ee368765bb06c5ea109b6bcec0420a8f04514b',
  'Edible (Liquid)': 'bed636233aeb65a26c408f0fc367e59416179574',
  Tincture: '8ba80b6a4d7ed52e080152c23f858fe9baf835ad',
  Extract: 'b854bd45c21efcd85264943a0c2d3a8787de36ea',
  Concentrate: 'e5e25725557f9f1a28fdea2f50907e7aa6699670',
  'Topical (Solid)': '8dbf0b696aa1070045adc8a25575c88cb43fe2ba',
  'Topical (Liquid)': '92ea54d4f618bf93f3ad6a6f3e021b7bfc04eb90',
  'Transdermal Patch': 'aa8edb7947d26ca58c9b689d13bee608a750eb47',
  'Capsule (Solid)': '57ea218f622637eee16b40460f1b389541980f09',
  'Capsule (Liquid)': '9f7c46648f5c0bd914c3763380d6eab280ae18c3',
  'Suppository (Solid)': 'fece2338dc8a252a9f628086388741730b49f89b',
  'Suppository (Liquid)': 'ffbe9a3b1d0753c2b86071d964489af1f5e43b00',
  'Combined Category': '461393ff5717dbe25a4528d5f54c54fbcfab64be',
  'Immature Plant': 'bf52471028f0f5ebcc9ba2f545d0d051fd88c573',
  Seed: '84dd7e05c946a42cf0a9fc4fc4feef4f1eb466d1',
  Merchandise: 'adc26aa9c3f82bc0d015072d193119792cdfa178',
  'Usable Hemp': '205ac176440987303a47c0075bf42467ed8db83e',
  'Hemp Stalk': '3abfc9537263bba2a0c77f8871176ea1835f0125',
  'Hemp Cannabinoid Capsule': '76f92952bd088b978282cfb1affbc081d5ee804f',
  'Hemp Edible': '7fcbac1f3d3db2bfd105fdc72afed9e13ee38486',
  'Hemp Tincture': 'f5225042395a9216ed8c02be36174c4711060966',
  'Hemp Topical': '1371b5fea3e9d26de5476689a2b7a01419182674',
  'Hemp Transdermal Patch': 'ca80b5ee02e65bdda2f0c052b84e116d149ce844',
  'Hemp Concentrate': '0d9320cc86db23b2603e162653efef08c2b5f9fe',
  'Hemp Extract': '9174c149c9a2cdc8f7ec49795cf7af75fee5828c',
  Inhalable: 'e67ed2b0986d5ab27b12c71d77d1e27104f59d60',
  'Hemp Inhalable': '864540ac81f5591231f72ed2d232e035e7417735',
}

// An example of the "categories" (groupings) that is being used for all instances groupings until
// specific groupings are defined per use case.
export const defaultGroupings = [
  {
    name: 'Flower',
    id: 'flower',
    salesTypes: [
      salesTypes.Buds,
      salesTypes['Shake/Trim'],
    ],
  }, {
    name: 'Non-Infused Pre-roll',
    id: 'noninfused-preroll',
    salesTypes: [
      salesTypes['Non-Infused Pre-roll'],
    ],
  }, {
    name: 'Edible',
    id: 'edible',
    salesTypes: [
      salesTypes['Edible (Liquid)'],
      salesTypes['Edible (Solid)'],
      salesTypes.Tincture,
    ],
  }, {
    name: 'Concentrate',
    id: 'concentrate',
    salesTypes: [
      salesTypes.Extract,
      salesTypes.Concentrate,
      salesTypes.Inhalable,
    ],
  }, {
    name: 'Other Cannabis',
    id: 'other',
    salesTypes: [
      salesTypes['Topical (Solid)'],
      salesTypes['Topical (Liquid)'],
      salesTypes['Transdermal Patch'],
      salesTypes['Capsule (Solid)'],
      salesTypes['Capsule (Liquid)'],
      salesTypes['Suppository (Solid)'],
      salesTypes['Suppository (Liquid)'],
      salesTypes['Combined Category'],
      salesTypes['Infused Pre-roll'],
    ],
  }, {
    name: 'Plant / Seed',
    id: 'plant',
    salesTypes: [
      salesTypes['Immature Plant'],
      salesTypes.Seed,
    ],
  }, {
    name: 'Merchandise',
    id: 'merchandise',
    salesTypes: [
      salesTypes.Merchandise,
    ],
  }, {
    name: 'Usable Hemp',
    id: 'usableHemp',
    salesTypes: [
      salesTypes['Usable Hemp'],
      salesTypes['Hemp Stalk'],
    ],
  }, {
    name: 'Hemp Cannabinoid Product',
    id: 'hempCannabinoidProduct',
    salesTypes: [
      salesTypes['Hemp Cannabinoid Capsule'],
      salesTypes['Hemp Edible'],
      salesTypes['Hemp Tincture'],
      salesTypes['Hemp Topical'],
      salesTypes['Hemp Transdermal Patch'],
    ],
  }, {
    name: 'Hemp Concentrate',
    id: 'hempConcentrate',
    salesTypes: [
      salesTypes['Hemp Concentrate'],
      salesTypes['Hemp Extract'],
      salesTypes['Hemp Inhalable'],
    ],
  },
]

// TODO: names are flimsy, should probably use the portalTag instead
// given a Metrc category, return the array of salesType names associated with the category
const metrcCategoriesMap = {
  Buds: ['Buds', 'Non-Infused Pre-roll'],
  'Buds (by strain)': ['Buds', 'Non-Infused Pre-roll'],
  'Shake/Trim': ['Shake/Trim', 'Non-Infused Pre-roll'],
  'Shake/Trim (by strain)': ['Shake/Trim', 'Non-Infused Pre-roll'],
  Edibles: ['Edible (Liquid)', 'Edible (Solid)'],
  'Edibles (each)': ['Edible (Liquid)', 'Edible (Solid)'],
  Tinctures: ['Tincture'],
  'Tinctures (each)': ['Tincture'],
  Extracts: ['Extract'],
  'Extracts (each)': ['Extract'],
  Concentrate: ['Concentrate'],
  'Concentrate (each)': ['Concentrate'],
  'Immature Plants': ['Seed', 'Immature Plant'],
  'Infused Pre-roll': ['Infused Pre-roll'],
  'Non-Infused Pre-roll': ['Non-Infused Pre-roll'],
  'Infused Pre-Roll': ['Infused Pre-roll'],
  'Non-Infused (Plain) Pre-Roll': ['Non-Infused Pre-roll'],
  'Seeds (each)': ['Seed'],
  'Seeds (weight)': ['Seed'],
  Topicals: ['Topical (Liquid)', 'Topical (Solid)'],
  'Topicals (each)': ['Topical (Liquid)', 'Topical (Solid)'],
  'Transdermal Patch': ['Transdermal Patch'],
  'Transdermal Patch (each)': ['Transdermal Patch'],
  Capsule: ['Capsule (Solid)', 'Capsule (Liquid)'],
  'Capsule (each)': ['Capsule (Solid)', 'Capsule (Liquid)'],
  Suppository: ['Suppository (Solid)', 'Suppository (Liquid)'],
  'Suppository (each)': ['Suppository (Solid)', 'Suppository (Liquid)'],
  'Combined Category': ['Combined Category'],
  'Combined Category (each)': ['Combined Category'],
  Merchandise: ['Merchandise'],
  'Usable Hemp': ['Usable Hemp', 'Hemp Stalk'],
  'Hemp Cannabinoid Product': ['Hemp Cannabinoid Capsule', 'Hemp Edible', 'Hemp Tincture', 'Hemp Topical', 'Hemp Transdermal Patch'],
  'Hemp Cannabinoid Product (each)': ['Hemp Cannabinoid Capsule', 'Hemp Edible', 'Hemp Tincture', 'Hemp Topical', 'Hemp Transdermal Patch'],
  'Hemp Concentrate': ['Hemp Concentrate'],
  'Hemp Concentrate (each)': ['Hemp Concentrate'],
  'Hemp Extract': ['Hemp Extract'],
  'Hemp Extract (each)': ['Hemp Extract'],
  'Hemp Extracts': ['Hemp Extract'],
  'Hemp Extracts (each)': ['Hemp Extract'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives': ['Inhalable'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (each)': ['Inhalable'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (with ingredients)': ['Inhalable'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (each; with ingredients)': ['Inhalable'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives': ['Hemp Inhalable'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (each)': ['Hemp Inhalable'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (with ingredients)': ['Hemp Inhalable'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (each; with ingredients)': ['Hemp Inhalable'],
}

// This map is similar to metrcCategoriesMap, but instead of returning the names of salesTypes, it
// returns the ids of all the groupings those salesTypes belong to.
export const associatedGroupingsToMetrcCategoriesMap = {
  Buds: ['flower', 'noninfused-preroll'],
  'Buds (by strain)': ['flower', 'noninfused-preroll'],
  'Shake/Trim': ['flower', 'noninfused-preroll'],
  'Shake/Trim (by strain)': ['flower', 'noninfused-preroll'],
  Edibles: ['edible'],
  'Edibles (each)': ['edible'],
  Tincture: ['edible'],
  'Tincture (each)': ['edible'],
  Extracts: ['concentrate'],
  'Extracts (each)': ['concentrate'],
  Concentrate: ['concentrate'],
  'Concentrate (each)': ['concentrate'],
  'Immature Plants': ['plant'],
  'Seeds (each)': ['plant'],
  'Seeds (weight)': ['plant'],
  Topicals: ['other'],
  'Topicals (each)': ['other'],
  'Transdermal Patch': ['other'],
  'Transdermal Patch (each)': ['other'],
  Capsule: ['other'],
  'Capsule (each)': ['other'],
  Suppository: ['other'],
  'Suppository (each)': ['other'],
  'Combined Category': ['other'],
  'Combined Category (each)': ['other'],
  Merchandise: ['merchandise'],
  'Infused Pre-roll': ['other'],
  'Non-Infused Pre-roll': ['noninfused-preroll'],
  'Infused Pre-Roll': ['other'],
  'Non-Infused (Plain) Pre-Roll': ['noninfused-preroll'],
  'Usable Hemp': ['usableHemp'],
  'Hemp Cannabinoid Product': ['hempCannabinoidProduct'],
  'Hemp Cannabinoid Product (each)': ['hempCannabinoidProduct'],
  'Hemp Concentrate': ['hempConcentrate'],
  'Hemp Concentrate (each)': ['hempConcentrate'],
  'Hemp Extract': ['hempConcentrate'],
  'Hemp Extract (each)': ['hempConcentrate'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives': ['concentrate'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (each)': ['concentrate'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (with ingredients)': ['concentrate'],
  'Inhalable Cannabinoid Product with Non-Cannabis Additives (each; with ingredients)': ['concentrate'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives': ['hempConcentrate'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (each)': ['hempConcentrate'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (with ingredients)': ['hempConcentrate'],
  'Inhalable Hemp Cannabinoid Product with Non-Cannabis Additives (each; with ingredients)': ['hempConcentrate'],
}

const buildGrouping = (data, groupings) => {
  const newGroupings = []
  groupings.forEach((group) => {
    const newGroup = Object.assign({}, group)
    const newSalesTypes = []
    group.salesTypes.forEach((salesType) => {
      const newSalesType = data.find(item => (item.portalTag === salesType))
      newSalesTypes.push(newSalesType)
    })
    Object.assign(newGroup, { salesTypes: newSalesTypes })
    newGroupings.push(newGroup)
  })
  return newGroupings
}

export const findGrouping = (typePortalTag, groupings) => (
  groupings.find(grouping => (
    grouping.salesTypes.find(salesType => salesType.portalTag === typePortalTag)
  ))
)

// withSalesTypes accepts a grouping from this file to define what groupings the salesTypes should
// be divided into before they are returned.
export const withSalesTypes = groupings => compose(
  withVenueID,
  graphql(getSalesTypes, {
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    props: ({ data, ownProps }) => {
      const newSalesTypes = get(data, 'store.salesTypes')
      const salesTypeData = {
        salesTypes: newSalesTypes ? buildGrouping(newSalesTypes, groupings) : [],
        loading: data.loading,
        error: data.error,
      }
      return { salesTypeData, ...ownProps }
    },
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export const getSalesTypesFromMetrcCategory = (metrcCategory = '', salesTypesData = []) => {
  const salesCategories = [] // final return
  const metrcSalesTypes = get(metrcCategoriesMap, metrcCategory, [])
  salesTypesData.forEach((cat) => {
    cat.salesTypes.forEach((subCat) => {
      if (metrcSalesTypes.includes(subCat.name)) {
        salesCategories.push(subCat)
      }
    })
  })
  return salesCategories
}
