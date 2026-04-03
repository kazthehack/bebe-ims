//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Form } from 'react-final-form'
import { get, keyBy } from 'lodash'
import { FormToggle } from 'components/common/input/Toggle'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import { Table, TwoLine } from 'components/Table'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import colors from 'styles/colors'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import InventoryNavigationBar from '../InventoryNavigation'

const StyledTable = styled(Table)`
  .rt-table {
    overflow: hidden;
  }
`

const categories = [{
  label: 'Flower',
  description: 'Cannabis bud/flower products by weight or pre-packaged',
}, {
  label: 'Pre-roll',
  description: 'Cannabis pre-rolls made of loose bud or shake/trim',
}, {
  label: 'Edibles',
  description: 'Cannabis edibles and beverages, including tinctures',
}, {
  label: 'Concentrate',
  description: 'Concentrates including extracts, cartridges, vaporizers, shatter',
}, {
  label: 'Other Cannabis',
  description: 'Other cannabis products, including skin or hair topicals, pills/capsules, patches, combined products (eg. a single item which includes usable marijuana and concentrate), etc.',
}, {
  label: 'Plant / Seed',
  description: 'Clones, seedlings, and seeds',
}, {
  label: 'Merchandise',
  description: 'All non-cannabis products: glassware, vape devices, accessories, apparel, supplies and paraphernalia etc.',
}, {
  label: 'Usable Hemp',
  description: 'Hemp flowers, leaves, and stalks.',
}, {
  label: 'Hemp Cannabinoid Product',
  description: 'Hemp capsules, edibles, tinctures, topicals, and transdermal patches.',
}, {
  label: 'Hemp Concentrate/Hemp Extract',
  description: 'Hemp concentrates and extracts.',
}]

const columns = editing => ([{
  Header: <TwoLine top={'screen'} bottom={'name'} />,
  accessor: 'name',
  minWidth: 150,
  sortable: false,
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    <span
      style={
        { color: colors.grayDark2,
          fontSize: '16px' }
      }
    >
      {value}
    </span>
  ),
}, {
  Header:
  <Fragment>
    Active
    <TooltipWithIcon
      text="These toggles determine if a screen will be visible on the POS."
      style={{ marginTop: '1px' }}
    />
  </Fragment>,
  accessor: 'name',
  width: 100,
  sortable: false,
  Cell: ({ value }) => ( // eslint-disable-line react/prop-types
    <FormToggle
      name={`${value}.active`}
      disabled={!editing}
      checkedStatusText=""
      uncheckedStatusText=""
    />
  ),
}, {
  Header: 'description',
  accessor: 'name',
  minWidth: 700,
  sortable: false,
  getTdProps: () => ({ style: { fontSize: '16px', whiteSpace: 'normal' } }),
  Cell: ({ value }) => get(categories.find(category => category.label === value), 'description'),
}])

const initialValues = ({ store }) => {
  const screens = get(store, 'screens', [])
  return ({
    ...keyBy(screens, screen => screen.name),
  })
}

const PosCategories = ({ editing, setEditing, confirm, screenData, onSubmit, userPermissions }) => (
  <div style={{ position: 'relative' }}>
    <Title>POS categories</Title>
    <InventoryNavigationBar />
    <Form
      initialValues={initialValues(screenData)}
      onSubmit={onSubmit}
      keepDirtyOnReinitialize // This is needed for proper polling functionality on edited fields
      render={({ handleSubmit, form, pristine, submitting }) => (
        <form onSubmit={handleSubmit}>
          <SingleItemGrid>
            <StyledTable
              noHover
              columns={columns(editing)}
              data={get(screenData, 'store.screens', [])}
              loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
              loading={screenData ? screenData.loading : true}
            />
          </SingleItemGrid>
          {userPermissions.write && !editing &&
            <FixedFooterContainer
              showEdit
              onEdit={() => setEditing(true)}
            />
          }
          {editing &&
            <FixedFooterContainer
              showCancel
              onCancel={() => {
                if (pristine) setEditing(false)
                else {
                  confirm({ message: 'Your changes will not be saved. Do you want to continue?' })
                    .then((confirmed) => {
                      if (confirmed) {
                        form.setConfig('keepDirtyOnReinitialize', false)
                        form.reset()
                        setEditing(false)
                      }
                    })
                }
              }}
              showSave={userPermissions.write}
              saveButtonType="submit"
              saveDisabled={pristine || submitting}
            />
          }
        </form>
      )}
    />
  </div>
)

PosCategories.propTypes = {
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  confirm: PropTypes.func,
  screenData: PropTypes.object,
  onSubmit: PropTypes.func,
  userPermissions: UserPermissionsPropType,
}

export default compose(
  withQueryErrorPageOnError('screenData', true),
)(PosCategories)
