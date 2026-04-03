import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { Table, TwoLine } from 'components/Table'
import { RadioButtonGroup, FormRadioButton } from 'components/common/input/RadioButton'
import { get } from 'lodash'

const tableStyle = {
  padding: '20px',
  minWidth: '700px',
  margin: '0 auto',
}

const columns = (radioButtonValue, setOnchange, setSelectedPackage) => [{
  Header: <TwoLine top="Select" bottom="Package" />,
  accessor: 'select',
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    <RadioButtonGroup style={{ marginLeft: '25%', marginTop: '25%' }}>
      <FormRadioButton
        name="selectedPackage"
        value={original.providerInfo.tag}
        checked={original.providerInfo.tag === radioButtonValue}
        onChange={(e) => {
          setOnchange(e.target.value)
          setSelectedPackage(e.target.value)
        }}
      />
    </RadioButtonGroup>
  ),
}, {
  Header: <TwoLine top="Received" bottom="Date" />,
  accessor: 'dateReceived',
  Cell: ({ value }) => (value ? format(value, 'MM/DD/YY') : ''),
}, {
  Header: 'Tag',
  accessor: 'providerInfo.tag',
  style: { color: 'blue' },
  minWidth: 215,
}, {
  Header: 'Name',
  accessor: 'providerInfo.metrcProduct.name',
}, {
  Header: 'Source',
  accessor: 'producerName',
}]

const SelectPackageTable = ({ data = [], setSelectedPackage }) => {
  const sortedData = data.sort((a, b) =>
    (a.providerInfo.metrcProduct.name >= b.providerInfo.metrcProduct.name ? 1 : -1))
  const [radioButtonValue, setOnchange] = useState(get(sortedData[0], 'providerInfo.tag'))
  return (
    <Table
      data={data}
      columns={columns(radioButtonValue, setOnchange, setSelectedPackage)}
      style={tableStyle}
      getTbodyProps={() => ({ style: { maxHeight: '165px' } })}
      getTrProps={() => ({
        onClick: (e, original) => {
          setOnchange(get(data[original.index], 'providerInfo.tag'))
          setSelectedPackage(get(data[original.index], 'providerInfo.tag'))
        },
      })}
      getTdProps={() => ({
          style: {
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: 'var(--brownish-grey)',
          },
        }
      )}
      defaultSorted={[{
        id: 'providerInfo.metrcProduct.name',
        desc: false,
      }]}
    />
  )
}

SelectPackageTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  setSelectedPackage: PropTypes.func,
}

export default SelectPackageTable
