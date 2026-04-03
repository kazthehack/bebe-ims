//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ButtonModal, { defaultModalStyle, Header } from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { TwoLine, TableActionBar, SearchableCellText, PaginatedTable } from 'components/Table'
import { withVenueID } from 'components/Venue'
import ReactGA from 'react-ga'
import { cloneDeep, get, merge, isEmpty } from 'lodash'
import colors from 'styles/colors'
import { connectModal } from 'components/Modal'
import StatusIcon from 'components/common/display/StatusIcon'
import { compose } from 'recompose'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import withAssignProductToPackage from 'components/pages/inventory/packages/detail/withAssignProductToPackage'
import { Icon } from 'components/common/display'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withProductListToAssign } from 'components/pages/inventory/products/withProductList'
import { withState as withTableState } from 'store/modules/modals/assignProduct'
import * as GATypes from 'constants/GoogleAnalyticsTypes'

const PAGE_SIZE = 50

const StyledTable = styled(PaginatedTable)`
  max-height: 70vh;
  .rt-thead {
    position: fixed;
    background-color: white;
    width: 918px; // setting it to 100% causes misalignment in the column
  }
  .rt-tbody {
    margin-top: 3.85em;
    max-height: calc(100vh - 400px);
  }
`

const SEARCH_OBJECT = [
  {
    fieldName: 'node.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.salesType.name',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.inventoryId',
    searchType: 'fuzzy',
  },
  {
    fieldName: 'node.packages.tags',
    searchType: 'exact',
  },
  {
    fieldName: 'node.packages.sources',
    searchType: 'fuzzy',
  },
]

const columns = table => ([{
  Header: 'active',
  accessor: 'node.posActive',
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    original.node && <StatusIcon active={original.node.posActive} />
  ),
  width: 120,
  getTdProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
  getHeaderProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
}, {
  Header: 'med',
  accessor: 'node.medicalOnly',
  width: 80,
  getTdProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
  getHeaderProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
  Cell: ({ original }) => (
    original.node.medicalOnly && <Icon name="bandages" />
  ),
}, {
  Header: 'id',
  accessor: 'node.inventoryId',
  width: 150,
  getTdProps: () => ({
    style: {
      color: colors.blue,
      fontFamily: 'Roboto Condensed, sans-serif',
      display: 'flex',
    },
  }),
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    <SearchableCellText text={original.node.inventoryId} table={table} />
  ),
}, {
  Header: 'name',
  accessor: 'node.name', // eslint-disable-next-line react/prop-types
  Cell: ({ original }) => <SearchableCellText text={original.node.name} table={table} />,
}, {
  Header: 'type',
  accessor: 'node.salesType.name',
  sortable: true,
  width: 200,
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    <SearchableCellText text={original.node.salesType.name} table={table} />
  ),
}, {
  Header: <TwoLine top="active" bottom="Packages" />,
  accessor: 'node',
  sortMethod: (a, b) => {
    const packagesA = (get(a, 'packages', []) || []).filter(pack => pack.finishedDate === null)
    const packagesB = (get(b, 'packages', []) || []).filter(pack => pack.finishedDate === null)
    if (packagesA.length === packagesB.length) {
      return 0
    }
    return packagesA.length > packagesB.length ? 1 : -1
  },
  Cell: ({ original }) => { // eslint-disable-line react/prop-types
    // filters for only usable packages and then counts how many there are
    const packages = get(original, 'node.packages', []) || []
    const numPackages = packages
      .filter(pack => pack.finishedDate === null)
      .length
    const style = numPackages === 0 ? { color: colors.red } : {}
    return (
      <span style={style}>{numPackages}</span>
    )
  },
  width: 100,
  getTdProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
  getHeaderProps: () => ({ style: { justifyContent: 'center', display: 'flex' } }),
}])

const DEFAULT_SORTING = [{
  id: 'node.posActive', // 'active' column
  desc: true,
}, {
  id: 'node.name', // 'name' column
  desc: false,
}]

const AssignProductTable = compose( // Needs proptypes. The linter misses it due to the HOCs
  withVenueID,
  withTableState,
  withProductListToAssign(),
  // TODO: should use table loading state for this instead of this HOC
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, 'productsData'),
  withQueryErrorPageOnError('productsData', true),
)(({
  productsData,
  setSelectedProduct,
  selected,
  setSorted,
  assignProductTable,
  tableResult,
  tableSearchTerm,
  setSearchTerm,
  setResult,
  setSort,
  setPage,
}) => (
  <>
    <div style={{ display: 'flex' }}>
      <TableActionBar
        search={(
          <SearchBox
            dataSource={get(productsData, 'store.products.edges')}
            fieldSearchDefinitions={SEARCH_OBJECT}
            setSearchTerm={setSearchTerm}
            setResult={setResult}
            result={tableResult}
            searchTerm={tableSearchTerm}
            showAllResults
          />
        )}
      />
    </div>
    <StyledTable
      data={get(productsData, 'store.products.edges')}
      columns={columns(assignProductTable)}
      style={{ width: 918 }}
      selected={selected}
      defaultSorted={DEFAULT_SORTING}
      getTrProps={() => ({
        onClick: (e, info) => {
          setSelectedProduct(info.original.node)
        },
      })}
      setSorted={setSorted}
      setSort={setSort}
      table={assignProductTable}
      isManual
      setPage={setPage}
      dataSize={get(productsData, 'store.products.totalCount', 0)}
      pageSize={PAGE_SIZE}
      searchedTerm={tableSearchTerm}
      paginationStyle={{
        position: 'absolute',
        bottom: '23px',
        marginRight: '25px',
      }}
    />
  </>
))

const ConnectedButtonModal = connectModal('AssignProductModalPure')(ButtonModal)

const AssignProductModalPure = ({
  pushModal,
  popModal,
  label,
  disabled,
  product,
  confirm,
  updatePristine,
  assignProductToPackage,
  packageId,
  selectedSalesType,
  openAssignProduct,
  setPage,
}) => {
  const [state, setState] = useState(
    { selectedProduct: product, selectedProductOnModalLaunch: !isEmpty(product) },
  )
  const { selectedProduct, selectedProductOnModalLaunch } = state

  // TODO: fix this selected product logic
  const setSelectedProduct = (p) => {
    const newSelectedProduct = (!selectedProduct
      || get(selectedProduct, 'id') !== get(p, 'id')) ? p : undefined
    setState({ ...state, selectedProduct: newSelectedProduct })
    updatePristine()
  }

  const onClickAssign = () => {
    const productId = get(selectedProduct, 'id')
    ReactGA.event({
      category: GATypes.eventCategories.package,
      action: GATypes.eventActions.assignedProduct,
      label: `${packageId}->${productId}`,
    })
    if (productId) {
      assignProductToPackage(true, {
        packageId,
        productId,
        oldProductId: get(selectedProductOnModalLaunch, 'id'),
      }) // packageId from Props
      setState({ ...state, selectedProductOnModalLaunch: selectedProduct })
    } else {
      assignProductToPackage(
        false,
        { packageId, productId: get(selectedProductOnModalLaunch, 'id') },
      ) // packageId from Props
      setState({ ...state, selectedProductOnModalLaunch: undefined })
    }
    popModal()
  }

  const onCancelConfirmation = () => {
    if (get(selectedProduct, 'id') !== get(selectedProductOnModalLaunch, 'id')) {
      confirm({ message: 'Changes will be discarded' }).then((confirmed) => {
        if (!confirmed) {
          pushModal('AssignProductModalPure')
        } else {
          setSelectedProduct(selectedProductOnModalLaunch)
        }
      })
    }
  }

  const onClickCancel = () => {
    popModal()
    onCancelConfirmation()
  }
  // merging specific modal style requirements with default modal styles
  // Had to put this hear so it would dynamically resize, though still requires some interaction
  const extendedModalStyle = merge(
    cloneDeep(defaultModalStyle), {
      content: {
        width: 1015,
        maxWidth: (window.innerWidth <= 950) ? window.innerWidth : 1015,
      },
    },
  )

  return (
    <>
      <Button
        disabled={disabled}
        primary
        style={{ width: '174px', height: '28px', float: 'right' }}
        onClick={() => {
          openAssignProduct()
          setPage({ page: 0 })
          pushModal('AssignProductModalPure')
        }}
      >
        {label}
      </Button>
      <ConnectedButtonModal
        style={extendedModalStyle}
        contentStyle={{ content: { overflow: 'hidden' } }}
        title="Assign product"
        header={(
          <Header style={{ marginLeft: 0, marginRight: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              Assign product
            </div>
          </Header>
        )}
        primaryButton={{
          text: selectedProduct ? 'assign' : 'unassign',
          onClick: onClickAssign,
          // the gets allows the case where product and selectedProduct would return {} to compare
          disabled: (get(product, 'id') === get(selectedProduct, 'id')),
        }}
        secondaryButton={{
          text: 'cancel',
          onClick: onClickCancel,
        }}
      >
        <AssignProductTable
          setSelectedProduct={setSelectedProduct}
          selected={get(selectedProduct, 'id')}
          selectedSalesType={selectedSalesType}
        />
      </ConnectedButtonModal>
    </>
  )
}

AssignProductModalPure.propTypes = {
  pushModal: PropTypes.func,
  popModal: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  assignProductToPackage: PropTypes.func,
  packageId: PropTypes.string,
  confirm: PropTypes.func,
  product: PropTypes.object,
  selectedSalesType: PropTypes.string,
  updatePristine: PropTypes.func,
  openAssignProduct: PropTypes.func,
  setPage: PropTypes.func,
}

export default compose(
  withVenueID,
  withAssignProductToPackage,
  withTableState,
)(AssignProductModalPure)
