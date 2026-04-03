//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { isEmpty, get, uniqBy } from 'lodash'
import styled from 'styled-components'
import withLinkNavigationConfirmation from 'components/Modal/withLinkNavigationConfirmation'
import { compose } from 'recompose'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { findGrouping, salesTypeDataPropTypes } from 'components/SalesTypes'
import { Table, CenteredColumn } from 'components/Table'
import StatusIcon from 'components/common/display/StatusIcon'
import colors from 'styles/colors'
import Spinner from 'components/common/display/Spinner'
import Button from 'components/common/input/Button'
import { withModals } from 'components/Modal'
import PrintBarcodeModal
  from 'components/pages/inventory/products/details/modals/PrintBarcodeModal'
import withAssociatedProductDetail from './withAssociatedProductDetail'
import AssignProductModal from '../modals/AssignProductModal'
import { InputContainer, SectionContainer, StyledFormSelectField, StyledSubHeader } from './PackageStyledComponents'


const StyledAnchor = styled.a`
  color: ${colors.blue};
  cursor: pointer;
`

const columns = ({
  packageId,
  salesTypeData,
  userPermissions,
  selectedSalesType,
  onNavAway,
  pristine,
  form,
}) => [{
  Header: 'status',
  accessor: 'posActive',
  width: 120,
  style: { paddingLeft: '0px' },
  headerStyle: { display: 'flex', justifyContent: 'center', paddingLeft: '0px' },
  // eslint-disable-next-line react/prop-types
  Cell: ({ value, original }) => (
    (original.noProductAssigned) ? (
      <span className="associatedProductWarningText" style={{ color: colors.red, fontSize: '16px', position: 'absolute', bottom: 19, paddingLeft: '6.5rem' }}>
        No product assigned.
      </span>
    ) : <StatusIcon active={value} />
  ),
}, {
  Header: 'Name',
  accessor: 'name',
  style: { justifyContent: 'left' },
  // eslint-disable-next-line react/prop-types
  Cell: ({ value, original }) => (
    <StyledAnchor
      onClick={() => onNavAway(pristine, `/inventory/products/edit/${original.id}`)}
    >
      {value}
    </StyledAnchor>
  ),
}, {
  Header: 'Category',
  accessor: 'Category',
  ...CenteredColumn,
  Cell: ({ original }) => {
    const portalTag = get(original, 'salesType.portalTag', '')
    const grouping = findGrouping(portalTag, salesTypeData.salesTypes)
    return get(grouping, 'name', '')
  },
}, {
  Header: 'Sub-category',
  accessor: 'salesType.name',
  ...CenteredColumn,
}, {
  Header: '',
  accessor: 're-assign',
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    userPermissions.write ? (
      <AssignProductModal
        label={original.noProductAssigned === true ? 'ASSIGN PRODUCT' : 'RE-ASSIGN'}
        product={original}
        packageId={packageId}
        selectedSalesType={selectedSalesType}
        updatePristine={() => form.change('altPristine', false)}
        disabled={!selectedSalesType}
        style={{ zIndex: 1 }}
      />
    )
      : null
  ),
}]

const AssociatedProductPure = ({
  product,
  packageId,
  loading,
  salesTypeOptions,
  salesTypeData,
  userPermissions,
  form,
  values,
  pristine,
  onNavAway,
  productData,
  pushModal,
  className,
  errors,
}) => {
  const portalTag = get(productData, 'node.salesType.portalTag', '')
  const grouping = findGrouping(portalTag, salesTypeData.salesTypes)
  const groupingValue = get(grouping, 'id')
  const flower = (groupingValue === 'flower' || groupingValue === 'usableHemp')
  const canna = groupingValue !== 'merchandise'
  const productIntermediate = isEmpty(product) ? { noProductAssigned: true } : product
  const selectedSalesType = get(values, 'salesType', '')
  const getWeightList = () => {
    const mappedWeight = get(productData, 'node.priceGroup.prices', []).map(item => ({
      // converting it because the SelectField expects a string
      name: item.quantityAmount.toString(),
      value: item.price.amount,
    }))
    return uniqBy(mappedWeight, 'name')
  }
  return (
    <Fragment>
      <SectionContainer>
        <StyledSubHeader>Associated product</StyledSubHeader>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <InputContainer style={{ marginBottom: 17 }}>
            <StyledFormSelectField
              name="salesType"
              label="Sales type"
              tooltip="Sales type is the link between a Metrc package type and Bloom category."
              options={salesTypeOptions}
              disabled={!get(userPermissions, 'write', false)}
            />
          </InputContainer>
          <InputContainer style={{ marginBottom: 17 }}>
            <Button
              style={{ marginLeft: '24px' }}
              primary
              onClick={() => {
                pushModal('PrintBarcodeModal')
              }}
              disabled={isEmpty(product)}
            >
              Print QR Label
            </Button>
            <PrintBarcodeModal
              isFromPkg
              canna={canna}
              flower={flower}
              data={get(productData, 'node')}
              type={get(productData, 'node.salesType.name')}
              values={values}
              form={form}
              packages={get(productData, 'node.packages', [])}
              weightList={getWeightList()}
              errors={errors}
              price={get(productData, 'node.priceGroup.prices[0].price.amount')}
              product={product}
            />
          </InputContainer>
        </div>
        <Table
          loadingText={(<Spinner size={4} wrapStyle={{}} />)}
          loading={loading}
          className={className}
          columns={columns({
            packageId,
            salesTypeData,
            userPermissions,
            selectedSalesType,
            onNavAway,
            pristine,
            form,
          })}
          data={[productIntermediate]}
          getTrProps={() => ({
            style: {
              paddingRight: '28px', // used to align assign/re-assign product with other buttons
            },
          })}
          getTheadTrProps={() => ({
            style: {
              paddingRight: '28px', // used to align assign/re-assign product with other buttons
            },
          })}
          getTdProps={() => ({
            style: {
              display: 'flex',
              justifyContent: 'center',
            },
          })}
        />
      </SectionContainer>
    </Fragment>
  )
}

AssociatedProductPure.propTypes = {
  product: PropTypes.object,
  salesTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  salesTypeData: salesTypeDataPropTypes, // TODO: fix some error with salesTypeData being undefined
  values: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  onNavAway: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  packageId: PropTypes.string.isRequired,
  userPermissions: UserPermissionsPropType.isRequired,
  form: PropTypes.object.isRequired,
  productData: PropTypes.object,
  pushModal: PropTypes.func,
  className: PropTypes.string,
  errors: PropTypes.object,
}

export default compose(
  withLinkNavigationConfirmation({ title: 'Discard changes', message: 'Discard changes made to this product record?' }),
  withAssociatedProductDetail,
  withModals,
)(AssociatedProductPure)
