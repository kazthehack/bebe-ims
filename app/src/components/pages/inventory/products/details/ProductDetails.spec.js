//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import { Form } from 'react-final-form'
import { BrowserRouter } from 'react-router-dom'
import getProducts, { mockProducts } from 'data/MockBloomAPI/products/getProducts'
import mountWithMocks from 'utils/test/mountWithMocks'
import ProductDetails from './ProductDetails'


// eslint-disable-next-line react/prop-types
const ProductDetailsWrapper = ({ product = getProducts.flower }) => {
  // we'll just take the initial flower price group as shared for now
  const { priceGroup } = product
  return (
    <ProductDetails
      product={product}
      userPermissions={{ write: true }}
      typeOptions={[]}
      priceGroups={[{ node: {
        // eslint-disable-next-line no-underscore-dangle
        ...priceGroup,
        prices: [...(priceGroup.prices.map(v => ({ ...v, __typename: 'price' })))],
        __typename: 'PriceGroups',
      },
      __typename: 'PriceGroups' }]}
    />
  )
}

describe('Load ProductDetails for each product type', () => {
  mockProducts.forEach((v) => {
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <ProductDetailsWrapper product={v} />
      </BrowserRouter>
    ))

    test(`Can Render ProductDetails for: ${v.name}`, () => expect(wrapper.isEmptyRender()).toBeFalsy())

    test(`Test Product Active Status for ${v.name}`, () => {
      const toggle = wrapper.find('FormToggle')
      expect(toggle.exists()).toBe(true)
      expect(toggle.find('input[type="checkbox"]').props().disabled).toBe(!!v.archivedDate)
    })

    test(`Test Product Details Form for ${v.name}`, () => {
      expect(wrapper.find(Form).exists()).toBe(true) // Parent Form is present
      // TODO: I wish there's an straigtforward way to check the form values
    })
  })
})
