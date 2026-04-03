import React from 'react'
import { get } from 'lodash'
import {
  unfinishedBudsPackageWithAssignedProduct,
  finishedBudsPackageWithAssignedProduct,
} from 'data/MockBloomAPI/packages/getPackages'
import { initialValuesMap, prepareSalesTypeOptions } from 'components/pages/inventory/packages/detail/withPackageDetails'
import { Form } from 'react-final-form'
import mountWithMocks from 'utils/test/mountWithMocks'
import mockSalesTypesList from 'data/mockSalesTypesList'
import PackageInventoryData from './PackageInventoryData'

// Helper function for unit abbreviation
const abbreviateUnit = unit => (unit === 'GRAMS' ? 'g' : 'ea')

// Sets up the mock data
const setupMockData = (packageData) => {
  // Package data
  const pkg = packageData.node
  // Get the sales type options
  const metrcSalesCategory = get(pkg, 'providerInfo.metrcProduct.category', '')
  const salesTypeOptions = prepareSalesTypeOptions(metrcSalesCategory, mockSalesTypesList)
  // Store data
  const store = get(packageData, 'store')
  const timezone = get(packageData, 'store.timezone')

  const productSalesType = get(pkg, 'product.salesType.id')
  const salesType = productSalesType || get(salesTypeOptions, '[0].value')
  const initialValues = initialValuesMap(pkg, store, salesType, timezone)
  return {
    pkg,
    packageIsFinished: !!pkg.finishedDate,
    initialValues,
    reasons: store.adjustReasons,
  }
}

describe('<PackageInventoryData />', () => {
  test('Unfinished Buds Package - Fields are shown properly and with correct data', () => {
    const {
      pkg,
      initialValues,
      packageIsFinished,
      reasons,
    } = setupMockData(unfinishedBudsPackageWithAssignedProduct)
    // Mount the `PackageInventoryData` component wrapped in a form and Redux and Apollo providers
    const wrapper = mountWithMocks(() => (
      <Form
        onSubmit={() => undefined}
        initialValues={initialValues}
        render={() => (
          <PackageInventoryData
            isOnHold={get(pkg, 'isOnHold', false)}
            values={initialValues}
            userPermissions={{ write: true, read: true }}
            onSubmitAdjustPackage={() => undefined}
            reasons={reasons}
            initialValues={initialValues}
            metrcReadOnly={false}
          />
        )}
      />
    ))
    // Test the active toggle state
    const activeToggle = wrapper.find('FormToggle')
    expect(activeToggle.find('input').prop('checked')).toBe(pkg.active)
    // Test the status of the buttons
    const buttons = wrapper.find('button')
    buttons.forEach(button => (expect(button.prop('disabled')).toBe(packageIsFinished)))
    // Test the value of the text fields
    const fields = wrapper.find('TextField')
    fields.forEach((field) => {
      switch (field.prop('name')) {
        case 'initialQuantity':
          expect(field.prop('value')).toBe(pkg.initialQuantity)
          expect(field.prop('disabled')).toBe(true)
          expect(field.prop('suffix')).toBe(abbreviateUnit(pkg.unit))
          break
        case 'quantity':
          expect(field.prop('value')).toBe(pkg.quantity)
          expect(field.prop('disabled')).toBe(true)
          expect(field.prop('suffix')).toBe(abbreviateUnit(pkg.unit))
          break
        case 'providerUnit':
          expect(field.prop('value')).toBe(pkg.providerUnit)
          expect(field.prop('disabled')).toBe(true)
          break
        case 'pricePaid':
          expect(field.prop('value')).toBe(pkg.pricePaid)
          expect(field.prop('prefix')).toBe('$')
          break
        case 'finishedDate':
          expect(field.prop('value')).toBe(pkg.finishedDate || 'Still Active')
          expect(field.prop('disabled')).toBe(true)
          break
        default:
          break
      }
    })
  })

  test('Unfinished on hold Buds Package - On hold message is shown', () => {
    const {
      initialValues,
      reasons,
    } = setupMockData(finishedBudsPackageWithAssignedProduct)
    // Mount the `PackageInventoryData` component wrapped in a form and Redux and Apollo providers
    const wrapper = mountWithMocks(() => (
      <Form
        onSubmit={() => undefined}
        initialValues={initialValues}
        render={() => (
          <PackageInventoryData
            isOnHold
            values={initialValues}
            userPermissions={{ write: true, read: true }}
            onSubmitAdjustPackage={() => undefined}
            reasons={reasons}
            initialValues={initialValues}
            metrcReadOnly={false}
          />
        )}
      />
    ))
    const divs = wrapper.find('div')
    // Check whether the `onHold` message is shown as expected
    divs.forEach((div) => {
      if (div.prop('className') === 'sc-iQKALj kemWgs') {
        expect(div.prop('text') === 'ON HOLD - THIS PACKAGE MAY REQUIRE REMEDIATION')
      }
    })
  })

  test('Finished Package - Buttons are disabled', () => {
    const {
      pkg,
      initialValues,
      packageIsFinished,
      reasons,
    } = setupMockData(finishedBudsPackageWithAssignedProduct)
    // Mount the `PackageInventoryData` component wrapped in a form and Redux and Apollo providers
    const wrapper = mountWithMocks(() => (
      <Form
        onSubmit={() => undefined}
        initialValues={initialValues}
        render={() => (
          <PackageInventoryData
            isOnHold={get(pkg, 'isOnHold', false)}
            values={initialValues}
            userPermissions={{ write: true, read: true }}
            onSubmitAdjustPackage={() => undefined}
            reasons={reasons}
            initialValues={initialValues}
            metrcReadOnly={false}
          />
        )}
      />
    ))
    // Test the active toggle state
    const activeToggle = wrapper.find('FormToggle')
    expect(activeToggle.find('input').prop('checked')).toBe(pkg.active)
    // Test the status of the buttons
    const buttons = wrapper.find('button')
    buttons.forEach(button => (expect(button.prop('disabled')).toBe(packageIsFinished)))
  })
})
