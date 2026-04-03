import React from 'react'
import PropTypes from 'prop-types'

const NETWORK_STATUS_READY = 7

// TODO: delete this file
export const mockSalesCategories = [
  {
    name: 'Edibles',
    value: 'edible', // TODO: flatten this inconsistency. dropped s to match other uses
    id: 's0',
    salesTypes: [
      {
        name: 'Edible',
        value: 'edible',
        unit: 'EACH',
        id: 't0',
        salesCategory: {
          name: 'Edibles',
        },
      },
      {
        name: 'Beverage',
        value: 'beverage',
        unit: 'EACH',
        id: 't1',
        salesCategory: {
          name: 'Edibles',
        },
      },
    ],
  },
  {
    name: 'Flower',
    value: 'flower',
    id: 's1',
    salesTypes: [
      {
        name: 'Bud',
        value: 'bud',

        unit: 'GRAMS',
        id: 'type-flower-shake-trim',
      },
      {
        name: 'Shake/Trim',
        value: 'shake/trim',
        unit: 'GRAMS',
        id: 'type-pre-roll-shake-trim',
      },
    ],
  },
  {
    name: 'Concentrates',
    value: 'concentrate', // TODO: flatten this inconsistency. dropped s to match other uses
    id: 's2',
    salesTypes: [
      {
        name: 'Extract',
        value: 'extract',
        unit: 'GRAMS',
        id: 't4',
        salesCategory: {
          name: 'Concentrates',
        },
      },
      {
        name: 'Concentrate',
        value: 'concentrate',
        unit: 'GRAMS',
        id: 't5',
        salesCategory: {
          name: 'Concentrates',
        },
      },
    ],
  },
  {
    name: 'Pre-Roll',
    value: 'preroll',
    id: 's3',
    salesTypes: [
      {
        name: 'Bud PreRoll',
        value: 'bud preroll',
        unit: 'GRAMS',
        id: 'type-cannabis-topical',
      },
      {
        name: 'Shake/Trim PreRoll',
        value: 'shake/trim preroll',
        unit: 'GRAMS',
        id: 'type-transdermal patch',
      },
    ],
  },
  {
    name: 'Other',
    value: 'oral', // TODO: flatten this inconsistency. changed to match other uses
    id: 's4',
    salesTypes: [
      {
        name: 'Topical',
        value: 'topical',
        unit: 'GRAMS',
        id: 'type-extract',
      },
    ],
  },
  {
    name: 'Concentrate',
    id: 'cat-concentrate',
    salesTypes: [
      {
        name: 'Transdermal Patch',
        value: 'transdermal patch',
        unit: 'EACH',
        id: 't9',
        salesCategory: {
          name: 'Other',
        },
      },
    ],
  },
  {
    name: 'Other',
    id: 'cat-other',
    salesTypes: [
      {
        name: 'Other Cannabinoid Product',
        value: 'other cannabinoid product',
        unit: 'EACH',
        id: 'type-other-cannabis-product',
      },
      {
        name: 'Capsule',
        value: 'capsule',
        unit: 'EACH',
        id: 'type-capsule',
      },
      {
        name: 'Suppository',
        value: 'suppository',
        unit: 'EACH',
        id: 'type-suppository',
      },
      {
        name: 'Combined',
        value: 'combined',
        unit: 'GRAMS',
        id: 'type-combines-category',
      },
    ],
  },
  {
    name: 'Plant/Seeds',
    value: 'plant', // TODO: flatten this inconsistency. Changed to match other uses.
    id: 's5',
    salesTypes: [
      {
        name: 'Immature Plant',
        value: 'immature plant',
        unit: 'EACH',
        id: 'type-immature-plant',
      },
      {
        name: 'Seed',
        value: 'seed',
        unit: 'EACH',
        id: 'type-seed',
      },
    ],
  },
  {
    name: 'Merchandise',
    value: 'merchandise',
    id: 's6',
    salesTypes: [
      {
        name: 'Merchandise',
        value: 'merchandise',
        unit: 'EACH',
        id: 'type-merchandise',
      },
    ],
  },
].map(category => ({
  ...category,
  // Add reference to sales category to sales type objects
  salesTypes: category.salesTypes.map(
    salesType => ({ ...salesType, salesCategory: category }),
  ),
}))

const salesCategoriesData = {
  loading: false,
  error: false,
  networkStatus: NETWORK_STATUS_READY,
  store: {
    salesCategories: mockSalesCategories,
  },
}

export const withSalesCategories = C => props => (
  <C
    {...props}
    salesCategoriesData={salesCategoriesData}
    salesCategories={mockSalesCategories}
  />
)

export const SalesCategoriesPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    salesTypes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        unit: PropTypes.oneOf(['EACH', 'GRAMS']),
        id: PropTypes.string,
        salesCategory: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }),
)
