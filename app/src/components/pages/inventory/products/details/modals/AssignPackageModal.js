//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import { withModals, connectModal } from 'components/Modal'
import Button from 'components/common/input/Button'
import ReactGA from 'react-ga'
import { SearchableCellText, PaginatedTable } from 'components/Table'
import { compose, withState } from 'recompose'
import { withVenueID } from 'components/Venue'
import { get, cloneDeep, remove, clone, map } from 'lodash'
import { salesTypeDataPropTypes } from 'components/SalesTypes'
import AltCheckbox from 'components/common/input/AltCheckbox'
import styled from 'styled-components'
import { packageSearchConfig } from 'constants/SearchConfigs'
import SearchBox from 'components/common/input/PoweredTableSearch'
import Spinner from 'components/common/display/Spinner'
import { withState as withTableState } from 'store/modules/modals/assignPackage'
import { packageColumns } from 'components/pages/inventory/packages/Packages'
import StatusIcon from 'components/common/display/StatusIcon'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import withPaginatedPackagesList from './withPaginatedPackagesList'

const SEARCH_TYPE = 'assignPackagesModal'

const StyledTable = styled(PaginatedTable)`
  width: 1150px;
  &&.rt-tbody {
    overflow-y: overlay;
    max-height: 470px;
    min-width: 946px !important; /* fixes FF specific horizontal scrollbar bug for this modal. */
  }
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const StyledModalHeader = styled.div`
  font-size: 26px;
  text-align: center;
  letter-spacing: 1px;
  font-weight: 500;
  color: #4d4d4d;
  margin-left: 15px;
`

export const Flex1 = styled.div`
  flex: 1;
`

// Helper function that updates the checked status of a row's checkbox
const updateCheckboxValue = (id, values, form, prevProduct) => {
  if (get(values, `originalAssignedPackages.${id}`, false)) {
    form.change(`originalAssignedPackages.${id}`, false)
  } else {
    // Rather than simply set this to true, if there was a previous product the package was assigned
    // to, we assign the value to the previous product's ID instead. It will still be truthy.
    form.change(
      `originalAssignedPackages.${id}`,
      prevProduct ? prevProduct.id : true,
    )
  }
}

const columns = (values, form, table) => [{
  Header: 'assign',
  accessor: 'node.id',
  sortable: false,
  width: 85,
  getTdProps: () => ({ style: { paddingLeft: '5px', justifyContent: 'center', display: 'flex' } }),
  getHeaderProps: () => ({ style: { paddingLeft: '5px' } }),
  Cell: ({ value, original }) => ( // eslint-disable-line react/prop-types
    <AltCheckbox
      style={{ transition: 'none', transform: 'none' }} // The checkbox animations are disabled here for now.
      key={`checkbox${value}`}
      // Cast the val to a bool because it could be bool, object, or string
      checked={!!values.originalAssignedPackages[value]}
      onChange={(e) => {
        e.stopPropagation()
        updateCheckboxValue(value, values, form, original.node.product)
      }}
    />
  ),
  sortMethod: (a, b) => {
    const valA = get(values.originalAssignedPackages, a, false)
    const valB = get(values.originalAssignedPackages, b, false)
    if (!!valA === !!valB) return 0
    if (valA) return -1
    return 1
  },
},
{
  Header: 'active',
  accessor: 'node.active',
  getTdProps: () => ({ style: { justifyContent: 'center', display: 'flex', padding: 'unset', flex: '90 0 auto', width: '80px', maxWidth: '80px' } }),
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    typeof value === 'boolean' ? <StatusIcon active={value} /> : ''
  ),
  width: 90,
},
{
  ...packageColumns.receivedDate,
  width: 90,
},
{
  ...packageColumns.name(table),
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    <SearchableCellText text={value} table={table} />
  ),
  width: 170,
},
{
  ...packageColumns.tag(table),
  width: 150,
},
{
  ...packageColumns.associatedProduct(table),
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    <SearchableCellText text={value} table={table} />
  ),
},
{
  ...packageColumns.producerName,
  Header: 'source',
  accessor: 'node.producerName',
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    <SearchableCellText text={value} table={table} />
  ),
},
packageColumns.amountRemaining,
]

// active > received date > amount remaining
const defaultSorting = [{
  id: 'node.active', // 'active' column
  desc: true,
}, {
  id: 'node.dateReceived', // 'received date' column
  desc: false,
}, {
  id: 'node.quantity', // 'amount remaining' column
  desc: false,
}]

// eslint-disable-next-line react/prop-types
const AssignPackageTable = ({
  values,
  form,
  packagesData,
  loading,
  setSort,
  table,
  setPage,
  pagination,
  dataSize,
  updatePagination,
}) => (
  <StyledTable
    data={packagesData}
    columns={columns(values, form, table)}
    defaultSorted={defaultSorting}
    getTrProps={() => (
        {
          onClick: (e, { original }) => {
            updateCheckboxValue(original.node.id, values, form, original.node.product)
          },
        }
      )}
    loading={loading}
    loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
    setSort={setSort}
    setPage={setPage}
    pagination={pagination}
    fetchData={updatePagination}
    table={table}
    dataSize={dataSize}
    isManual
    paginationStyle={{
        position: 'absolute',
        bottom: '23px',
        marginRight: '25px',
      }}
    multiSort
  />
)

AssignPackageTable.propTypes = {
  packagesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  values: PropTypes.object,
  form: PropTypes.object,
  table: PropTypes.object,
  setPage: PropTypes.func,
  pagination: PropTypes.object,
  dataSize: PropTypes.number,
  setSort: PropTypes.func,
  updatePagination: PropTypes.func,
}

const ConnectedModal = connectModal('AssignPackageModal')(ButtonModal)

const AssignPackageModal = compose(
  withVenueID,
  withTableState,
  withState('paginationState', 'setPaginationState', {
    pageSize: 50,
    pagesSkipped: 0,
  }),
  withState('salesTypes', 'setSalesTypes', []),
  withPaginatedPackagesList,
)(({
  pushModal,
  popModal,
  values,
  form,
  packagesListData,
  assignPackageTable,
  assignPackageResult,
  assignPackageSearchTerm,
  setSearchTerm,
  setResult,
  setSort,
  openAssignPackage,
  setPage,
  paginationState,
  setPaginationState,
  setSalesTypes,
  onSubmit,
}) => {
  const ids = map(get(values, 'originalAssignedPackages'), value => value.id)
  const clonedPackages = clone(get(packagesListData, 'store.packages.edges'))
  const data = remove(clonedPackages, pkg => !ids.includes(get(pkg, 'node.id')))

  useEffect(() => {
    setSalesTypes([values.type])
  }, [get(packagesListData, 'store.packages.edges')])

  const updatePagination = ({ pagesSkipped }) => {
    setPaginationState(state => ({ ...state, pagesSkipped }))
  }

  return (
    <Fragment>
      <Button
        primary
        onClick={() => {
          openAssignPackage()
          pushModal('AssignPackageModal')
        }}
      >
        Edit Packages
      </Button>
      <ConnectedModal
        contentStyle={{ content: { maxHeight: 'calc(100vh - 120px)' } }}
        primaryButton={{
          text: 'Assign',
          onClick: () => {
            const allPackages = get(packagesListData, 'store.packages.edges', [])
            form.change('assignedPackages', values.originalAssignedPackages)
            const assignedIds = Object.entries(values.originalAssignedPackages)
            const newPackageList = cloneDeep(values.copyPackages)
            assignedIds.forEach((entry) => {
              if (entry[1]) {
                if (!values.copyPackages.find(pack => pack.id === entry[0])) {
                  const newPackage = allPackages.find(pack => pack.node.id === entry[0])
                  if (newPackage) {
                    newPackageList.push(newPackage.node)
                    ReactGA.event({
                      category: GATypes.eventCategories.product,
                      action: GATypes.eventActions.assignedPackage,
                      label: `${values.id}->${get(newPackage, 'node.id')}`,
                    })
                  }
                }
              }
            })
            values.copyPackages.forEach((copPack) => {
              const found = assignedIds.find(([key, val]) => val && (copPack.id === key))
              if (!found) {
                const index = newPackageList.findIndex(pack => pack.id === copPack.id)
                newPackageList.splice(index, 1)
              }
            })
            form.change('copyPackages', newPackageList)
            onSubmit({
              packages: values.packages,
              id: values.id,
              assignedPackages: values.originalAssignedPackages,
              name: values.name,
            })
            packagesListData.refetch()
            setPage(0)
            popModal()
          },
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => {
            form.change('originalAssignedPackages', values.assignedPackages)
            setPage(0)
            popModal()
          },
        }}
      >
        <StyledHeader>
          <Flex1>
            <SearchBox
              dataSource={data}
              fieldSearchDefinitions={packageSearchConfig}
              type={SEARCH_TYPE}
              result={assignPackageResult}
              setSearchTerm={setSearchTerm}
              setResult={setResult}
              searchTerm={assignPackageSearchTerm}
              total={get(packagesListData, 'store.packages.totalCount', 0)}
              showAllResults
            />
          </Flex1>
          <StyledModalHeader>
            Edit packages
          </StyledModalHeader>
          <Flex1 />
        </StyledHeader>
        <AssignPackageTable
          values={values}
          form={form}
          packagesData={data}
          loading={get(packagesListData, 'loading', true)}
          table={assignPackageTable}
          setPage={setPage}
          setSort={setSort}
          pagination={{ paginationState, setPaginationState }}
          dataSize={get(packagesListData, 'store.packages.totalCount', 0)}
          updatePagination={updatePagination}
        />
      </ConnectedModal>
    </Fragment>
  )
})

AssignPackageModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  packagesListData: PropTypes.object,
  salesTypeData: salesTypeDataPropTypes,
  assignPackage: PropTypes.object,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
}

const AssignPackageModalHOC = C => compose(
  withModals,
)(C)

export default AssignPackageModalHOC(AssignPackageModal)
