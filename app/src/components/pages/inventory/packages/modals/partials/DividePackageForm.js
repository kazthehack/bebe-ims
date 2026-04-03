import React, { Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import {
  OriginalPackagePanel,
  NewPackageEntryPanel,
  NewPackageDisplayPanel,
  AssignProductPanel,
  NewProductPanel,
} from './DividePackagePanels'

// TODO: get rid of hard-coded example values
const newPackageMocks = {
  strain: '!Bubba Kush!',
  categoryOptions: [{
    name: 'Shake',
    value: 'SHAKE',
  }],
  tag: '!ABCDEF012345670000010042!',
  source: '!Green Farms!',
  date: '!4/20/2018!',
}

const mockAssignList = [
  { text: 'Bubba Kush - Top Shelf', key: 'bubbaTop' },
  { text: 'Bubba Kush - Mid Shelf', key: 'bubbaMid' },
  { text: 'Bubba Kush - Shake', key: 'bubbaShake' },
  { text: 'Bubba Kush - Pre-rolls', key: 'bubbaPre' },
]

const Panel = styled.div`
  display: inline-grid;
  text-align: center;
  font-size: 16px;
  font-weight: 900;
  color: ${colors.grayDark2};
`

const LeftPanel = styled(Panel)`
  margin-right: 40px;
`

const DividePackageForm = ({
  display,
  originalPackageData,
  data,
  newProductFunc,
  oldPackageParse,
  newPackageParse,
  moveAllFunc,
  onQuantityBlur,
}) => (
  <Fragment>
    {display === 0 ?
      <Fragment>
        <LeftPanel>Original Package:
          <OriginalPackagePanel
            data={originalPackageData}
            parse={oldPackageParse}
            onQuantityBlur={() => onQuantityBlur('oldPackageQuantity')}
          />
        </LeftPanel>
        <Panel>New Package:
          <NewPackageEntryPanel
            data={newPackageMocks}
            parse={newPackageParse}
            moveAllFunc={moveAllFunc}
            onQuantityBlur={() => onQuantityBlur('newPackageQuantity')}
          />
        </Panel>
      </Fragment>
      :
      <Fragment>
        <LeftPanel>New Package:
          <NewPackageDisplayPanel data={data} fakeData={newPackageMocks} />
        </LeftPanel>
        {display === 1 &&
          <Panel>Assign Connected Product:
            <AssignProductPanel newProductFunc={newProductFunc} data={mockAssignList} />
          </Panel>
        }
        {
          display === 2 &&
          <Panel>New Product:
            <NewProductPanel data={newPackageMocks} />
          </Panel>
        }
      </Fragment>
    }
  </Fragment>
)

DividePackageForm.propTypes = {
  display: PropTypes.number.isRequired,
  originalPackageData: PropTypes.object,
  data: PropTypes.object,
  newProductFunc: PropTypes.func.isRequired,
  oldPackageParse: PropTypes.func.isRequired,
  newPackageParse: PropTypes.func.isRequired,
  moveAllFunc: PropTypes.func.isRequired,
  onQuantityBlur: PropTypes.func.isRequired,
}

export default DividePackageForm
