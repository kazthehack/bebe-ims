import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormSelectField } from 'components/common/input/SelectField'
import Button from 'components/common/input/Button'
import Search from 'components/common/input/Search'
import { FormToggle } from 'components/common/input/Toggle'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { noop } from 'lodash'
import { FormTextField } from 'components/common/input/TextField'
import { combineValidators, required, floatValidator, sanitizedStringValidator, nonZero } from 'utils/validators'
import colors from 'styles/colors'
import { SearchListFieldWrapper } from 'components/SearchList'


const styles = {
  selectField: {
    width: '194px',
  },
  list: {
    height: '180px',
    borderRadius: '5px',
  },
  listItem: {
    fontSize: '14px',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  assignButton: {
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '100%',
  },
}

const Square = styled.div`
  width: 344px;
  height: 243px;
  border-radius: 2px;
  border: solid 1px ${colors.grayLight};
  margin-top: 8px;
  padding-top: 23px;
`

const HiddenSquare = styled(Square)`
  border: solid 1px transparent;
  padding-top: 0px;
  height: 266px;
  position: relative;
`

const Row = styled.div`
  font-weight: normal;
  text-align: left;
  margin: 0 8px 12px 8px;
  position: relative;
  width: calc(100% - 16px);
`

const FieldRow = styled(Row)`
  vertical-align: middle;
  height: 40px;
  line-height: 40px;
`

const RowValue = styled.div`
  text-align: right;
  display: inline-block;
  position: absolute;
  right: 0;
`

const CheckboxRowValue = styled(RowValue)`
  text-align: inherit;
`

const FieldRowValue = styled(RowValue)`
  width: 194px;
`

const StyledSearch = styled(Search)`
  height: 27px;
  border: solid 1px ${colors.grayLight};
  border-radius: 5px;
  width: 100%;
  max-width: none;
  input {
    font-size: 14px !important;
    height: 22px;
    border: none;
    box-shadow: none;
    outline: none;
    padding: 0;
    line-height: 27px;
    color: ${colors.grayLight};
    margin: 2px 0 0 8px;
    width: 95%;
    max-width: none;
  }
`

export const OriginalPackagePanel = ({ data, parse, onQuantityBlur }) => (
  <Square>
    <Row>Name:<RowValue>{data.name}</RowValue></Row>
    <Row>Strain:<RowValue>{data.strain}</RowValue></Row>
    <Row>Metrc Tag:<RowValue>{data.tag}</RowValue></Row>
    <Row>Source:<RowValue>{data.source}</RowValue></Row>
    <Row>Category:<RowValue>{data.category}</RowValue></Row>
    <FieldRow>Quantity:
      <FieldRowValue>
        <FormTextField
          suffix="G"
          name="oldPackageQuantity"
          type="text"
          parse={parse}
          validate={combineValidators(required, floatValidator)}
          onBlur={onQuantityBlur}
        />
      </FieldRowValue>
    </FieldRow>
  </Square>
)

OriginalPackagePanel.propTypes = {
  data: PropTypes.object,
  parse: PropTypes.func.isRequired,
  onQuantityBlur: PropTypes.func.isRequired,
}

export const NewPackageEntryPanel = ({ data, parse, moveAllFunc, onQuantityBlur }) => (
  <Square>
    <Row>Strain:<RowValue>{data.strain}</RowValue></Row>
    <FieldRow>Name:
      <FieldRowValue>
        <FormTextField type="text" name="newPackageName" validate={combineValidators(required, sanitizedStringValidator)} />
      </FieldRowValue>
    </FieldRow>
    <FieldRow>Category:
      <RowValue>
        <FormSelectField style={styles.selectField} name="category" options={data.categoryOptions} />
      </RowValue>
    </FieldRow>
    <FieldRow>Quantity:
      <FieldRowValue>
        <FormTextField
          type="text"
          name="newPackageQuantity"
          suffix="G"
          parse={parse}
          validate={combineValidators(required, nonZero, floatValidator)}
          onBlur={onQuantityBlur}
        />
      </FieldRowValue>
    </FieldRow>
    <Row><Button onClick={moveAllFunc} link>Move all</Button></Row>
  </Square>
)

NewPackageEntryPanel.propTypes = {
  data: PropTypes.object,
  parse: PropTypes.func.isRequired,
  moveAllFunc: PropTypes.func.isRequired,
  onQuantityBlur: PropTypes.func.isRequired,
}

export const NewPackageDisplayPanel = ({ data, fakeData }) => (
  <Square>
    <Row>Name:<RowValue>{data.newPackageName}</RowValue></Row>
    <Row>Strain:<RowValue>{fakeData.strain}</RowValue></Row>
    <Row>Metrc Tag:<RowValue>{fakeData.tag}</RowValue></Row>
    <Row>Source:<RowValue>{fakeData.source}</RowValue></Row>
    <Row>Category:<RowValue>{data.newPackageCategory}</RowValue></Row>
    <Row>Quantity:<RowValue>{data.newPackageQuantity}</RowValue></Row>
    <Row>Package Date:<RowValue>{fakeData.date}</RowValue></Row>
  </Square>
)

NewPackageDisplayPanel.propTypes = {
  data: PropTypes.object,
  fakeData: PropTypes.object,
}

export const AssignProductPanel = ({ data, newProductFunc }) => (
  <HiddenSquare>
    <StyledSearch onSearch={noop} />
    <SearchListFieldWrapper
      style={styles.list}
      itemStyle={styles.listItem}
      list={data}
      name="connectedProduct"
    />
    <Button onClick={newProductFunc} style={styles.assignButton}>Create a new product</Button>
  </HiddenSquare>
)

AssignProductPanel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  newProductFunc: PropTypes.func,
}

export const NewProductPanel = ({ data }) => (
  <Square>
    <FieldRow>
      <FormToggle
        checkedStatusText="Active"
        uncheckedStatusText="Inactive"
        labelStyle={{ display: 'inline-flex' }}
        name="newProductActive"
      />
      <CheckboxRowValue>
        <FormCheckbox
          name="newProductMedical"
          label="Medical Only:"
          boxOnRight
        />
      </CheckboxRowValue>
    </FieldRow>
    <FieldRow>Name:
      <FieldRowValue>
        <FormTextField
          type="text"
          name="newProductName"
          placeHolder="Product Name"
          validate={combineValidators(required, sanitizedStringValidator)}
        />
      </FieldRowValue>
    </FieldRow>
    <FieldRow>Category:
      <RowValue>
        <FormSelectField type="text" disabled style={styles.selectField} name="newProductCategory" options={[{ name: 'Flower', value: 'flower' }]} />
      </RowValue>
    </FieldRow>
    <FieldRow>(Type):
      <RowValue>
        <FormSelectField type="text" style={styles.selectField} name="newProductType" options={data.categoryOptions} />
      </RowValue>
    </FieldRow>
  </Square>
)

NewProductPanel.propTypes = {
  data: PropTypes.object,
}
