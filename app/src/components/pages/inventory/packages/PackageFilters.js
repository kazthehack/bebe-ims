import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Form, Field } from 'react-final-form'
import { capitalize, map, get, join, split, pickBy, identity, isEmpty, omit, sortBy, keys } from 'lodash'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import Select from 'react-select'
import ReactGA from 'react-ga'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormTextField } from 'components/common/input/TextField'
import Button from 'components/common/input/Button'
import {
  combineValidators,
  numberValidator,
  naturalNumberValidator,
  inRange,
} from 'utils/validators'
import * as GATypes from 'constants/GoogleAnalyticsTypes'

const FormContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const InputContainer = styled.div`
  flex: 50%;
  & > * {
    margin-bottom: 32px;
    margin-right: 20px;
  }
`
const StyledHeading = styled.h2`
  color: ${colors.blueishGray};
  font-size: 14px;
  text-transform: uppercase;
`
const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  width: 136px;
  margin-right: 24px;
`

const StyledFormGroupWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledFormCheckboxWrapper = styled(StyledFormGroupWrapper)`
  height: 36px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 16px;
`

const AmountFields = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ReactSelectAdapter = ({ onChangeHandler, input, ...rest }) => (
  <div style={{ maxWidth: '350px', width: '100%' }}>
    <Select
      key={get(input, 'name')}
      placeholder="Any"
      isClearable
      isSearchable
      onInputChange={onChangeHandler}
      {...input}
      {...rest}
    />
  </div>
)

ReactSelectAdapter.propTypes = {
  input: PropTypes.object.isRequired,
  onChangeHandler: PropTypes.func,
}

const finishedOptions = [{ name: 'All', value: 'all' }, { name: 'Finished', value: true }, { name: 'Unfinished', value: false }]

const PackageFiltersForm = ({
  storeBrands,
  storeStrains,
  storeSalesTypes,
  setFilters,
  filters,
  setPage,
}) => {
  const initialValuesMap = {
    active: undefined,
    needsAttention: undefined,
    finished: undefined,
    amountRemainingLowerBound: undefined,
    amountRemainingUpperBound: undefined,
    brandId: undefined,
    strainId: undefined,
    salesTypes: undefined,
  }

  const [initialValues, setInitialValues] = useState(initialValuesMap)

  useEffect(() => {
    if (filters) {
      setInitialValues({
        ...initialValuesMap,
        ...filters,
      })
    } else {
      setInitialValues(initialValuesMap)
    }
  }, [filters])

  // filter out merchandise option & sort alphabetically
  const filteredStoreSalesTypes = sortBy(storeSalesTypes.filter(salesType => salesType.name.toLowerCase() !== 'merchandise'), ['name'])

  return (
    <Form
      onSubmit={(values) => {
        // remove falsey values before submitting
        let finalValues = pickBy(values, identity)
        const { finished } = finalValues
        // make finished selection into boolean value
        finalValues = get(finished, 'value') === 'all' ? finalValues = omit(finalValues, ['finished']) : { ...finalValues, finished }
        ReactGA.event({
          category: GATypes.eventCategories.package,
          action: GATypes.eventActions.filtered,
          label: `${keys(finalValues)}`,
        })

        setFilters({ filters: finalValues })
        setPage({ page: 0 })
      }}
      initialValues={initialValues}
      render={({ handleSubmit, pristine, errors, form }) => (
        <form onSubmit={handleSubmit} >
          <StyledHeading>Show Only:</StyledHeading>
          <FormContentWrapper>
            <InputContainer>
              <StyledFormCheckboxWrapper>
                <FormCheckbox
                  name="active"
                  label="Active only"
                />
              </StyledFormCheckboxWrapper>
              <StyledFormCheckboxWrapper>
                <FormCheckbox
                  name="needsAttention"
                  label="Attention needed only"
                />
              </StyledFormCheckboxWrapper>
            </InputContainer>
            <InputContainer>
              <StyledFormGroupWrapper>
                <StyledLabel>Amount remaining</StyledLabel>
                <AmountFields>
                  <FormTextField
                    label="Amount Remaining"
                    type="number"
                    suffix="%"
                    name="amountRemainingLowerBound"
                    placeholder="0"
                    min={0}
                    validate={combineValidators(
                        numberValidator,
                        naturalNumberValidator,
                        v =>
                          inRange(0,
                          parseInt(form.getState().values.amountRemainingUpperBound, 10)
                          || 100)(parseInt(v, 10)),
                    )}
                  />
                  <div style={{ margin: '0 8px' }}> - </div>
                  <FormTextField
                    type="number"
                    suffix="%"
                    name="amountRemainingUpperBound"
                    placeholder="100"
                    validate={combineValidators(
                      numberValidator,
                      naturalNumberValidator,
                      v =>
                        inRange(parseInt(form.getState().values.amountRemainingLowerBound, 10)
                        || 0, 100)(parseInt(v, 10)),
                    )}
                  />
                </AmountFields>
              </StyledFormGroupWrapper>
              <StyledFormGroupWrapper>
                <StyledLabel>Category</StyledLabel>
                <Field
                  name="salesTypes"
                  component={ReactSelectAdapter}
                  isMulti
                  options={filteredStoreSalesTypes.map(salesType => ({
                        value: get(salesType, 'id'),
                        label: join(map(split(get(salesType, 'name'), ' '), capitalize), ' '),
                      }))}
                />
              </StyledFormGroupWrapper>
              <StyledFormGroupWrapper>
                <StyledLabel>Brand</StyledLabel>
                <Field
                  name="brandId"
                  component={ReactSelectAdapter}
                  options={storeBrands.map(brand => ({
                      value: get(brand, 'id'),
                      label: join(map(split(get(brand, 'name'), ' '), capitalize), ' '),
                    }))}
                />
              </StyledFormGroupWrapper>
              <StyledFormGroupWrapper>
                <StyledLabel>Strain</StyledLabel>
                <Field
                  name="strainId"
                  component={ReactSelectAdapter}
                  options={storeStrains.map(strain => ({
                      value: get(strain, 'id'),
                      label: join(map(split(get(strain, 'name'), ' '), capitalize), ' '),
                    }))}
                />
              </StyledFormGroupWrapper>
              <StyledFormGroupWrapper>
                <StyledLabel>Finished</StyledLabel>
                <Field
                  name="finished"
                  component={ReactSelectAdapter}
                  options={finishedOptions.map(finishedOption => ({
                      value: get(finishedOption, 'value'),
                      label: get(finishedOption, 'name'),
                  }))}
                />
              </StyledFormGroupWrapper>
            </InputContainer>
          </FormContentWrapper>
          <ButtonWrapper>
            <Button
              id="applyFilters"
              primary
              type="submit"
              disabled={!isEmpty(errors) || pristine}
            >
            Apply Filters
            </Button>
          </ButtonWrapper>
        </form>
  )}
    />
  )
}

PackageFiltersForm.propTypes = {
  storeBrands: PropTypes.arrayOf(PropTypes.object),
  storeStrains: PropTypes.arrayOf(PropTypes.object),
  storeSalesTypes: PropTypes.arrayOf(PropTypes.object),
  setFilters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  filters: PropTypes.object,
}

export default PackageFiltersForm
