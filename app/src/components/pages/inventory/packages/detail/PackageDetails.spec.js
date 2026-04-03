import React from 'react'
import { shallow } from 'enzyme'
import { get } from 'lodash'
import {
  unfinishedBudsPackageWithAssignedProduct,
} from 'data/MockBloomAPI/packages/getPackages'
import getSalesTypes from 'data/MockBloomAPI/salesTypes/getSalesTypes'
import mockSalesTypesList from 'data/mockSalesTypesList'
import { initialValuesMap, prepareSalesTypeOptions } from 'components/pages/inventory/packages/detail/withPackageDetails'
import { Form } from 'react-final-form'
import PackageDetailPure from './PackageDetail'

describe('<PackageDetailPure />', () => {
  it('Package should render PackageDetails Component', () => {
    // Package data
    const pkg = unfinishedBudsPackageWithAssignedProduct.node
    // Get the sales type options
    const metrcSalesCategory = get(pkg, 'providerInfo.metrcProduct.category', '')
    const salesTypeOptions = prepareSalesTypeOptions(metrcSalesCategory, mockSalesTypesList)
    // Store data
    const store = get(unfinishedBudsPackageWithAssignedProduct, 'store')
    const timezone = get(unfinishedBudsPackageWithAssignedProduct, 'store.timezone')

    const productSalesType = get(pkg, 'product.salesType.id')
    const salesType = productSalesType || get(salesTypeOptions, '[0].value')
    // cannot get mountWithMocks to work, so am just doing a shallow test, not super useful but
    // is a good starting place to test more useful components
    const wrapper = shallow(<PackageDetailPure
      packageDetailsData={unfinishedBudsPackageWithAssignedProduct}
      onCancel={() => (null)}
      salesTypeOptions={salesTypeOptions}
      salesTypeData={{ salesTypes: getSalesTypes.store.salesTypes, loading: false }}
      pkg={pkg}
      initialValues={initialValuesMap(pkg, store, salesType, timezone)}
      onSubmitAdjustPackage={() => (null)}
      onSubmitUpdatePackage={() => (null)}
      reasons={store.adjustReasons}
      storeStrains={store.strains}
      storeBrands={store.brands}
      userPermissions={{ write: true, read: true }}
      viewHarvestModal={() => (null)}
      venueSettings={{}}
    />)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find(Form).exists()).toBe(true) // Parent Form is present
  })
})

// TODO: get working mountWithMocks integration test
// const selectedVenueId = fullDataPackage.store.id
// const packageId = fullDataPackage.node.id
// describe('<PackageDetailPure />', () => {
//   it('Good Package should render PackageDetails Component', (done) => {
//     // set up
//     const pkg = fullDataPackage.node
//     const store = get(fullDataPackage, 'store')
//     const productSalesType = get(pkg, 'product.salesType.id')
//     const salesType = productSalesType || get(salesTypeOptions, '[0].value')
//     const wrapper = mountWithMocks(PackageDetailPure, [
//       {
//         request: {
//           query: addTypenameToDocument(getPackage),
//           variables: {
//             packageID: packageId,
//             storeID: selectedVenueId,
//           },
//         },
//         result: {
//           data: {
//             fullDataPackage,
//           },
//         },
//       },
//     ], { venues: { selectedId: selectedVenueId }, modals: [] })
//     const waitForTab = createWaitForElement(Form)
//     return waitForTab(wrapper).then(() => {
//       expect(wrapper.exists()).toBe(true)
//       //expect(wrapper.find(Form).exists()).toBe(true) // level 1 depth component
//       done()
//     })
//   })
// })
