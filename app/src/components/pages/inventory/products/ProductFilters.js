import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Form, Field } from 'react-final-form'
import { capitalize, map, get, join, split, pickBy, identity, isEmpty, omit, sortBy, keys } from 'lodash'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import ReactGA from 'react-ga'
import Select from 'react-select'
import Spinner from 'components/common/display/Spinner'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormTextField } from 'components/common/input/TextField'
import Button from 'components/common/input/Button'
import { withVenueID } from 'components/Venue'
import withPriceGroupProductsFilter from 'components/pages/inventory/priceGroups/withPriceGroupProductsFilter'
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
  max-width: 350px;
`

const StyledContainer = styled.div`
  max-width: 350px;
  width: 100%;
`

const ReactSelectAdapter = ({ onChangeHandler, input, ...rest }) => (
  <StyledContainer>
    <Select
      key={get(input, 'name')}
      placeholder="Any"
      isClearable
      isSearchable
      onInputChange={onChangeHandler}
      {...input}
      {...rest}
    />
  </StyledContainer>
)

ReactSelectAdapter.propTypes = {
  input: PropTypes.object.isRequired,
  onChangeHandler: PropTypes.func,
}

const PriceGroupsFilterPure = ({
  priceGroupData,
}) => {
  const priceGroups = get(priceGroupData, 'store.priceGroups.edges') || []
  const filteredPriceGroups = sortBy(priceGroups.filter(priceGroup =>
    get(priceGroup, 'node.shared')), ['node.name'])
  const priceGroupsLoading = get(priceGroupData, 'loading')
  return (
    <StyledFormGroupWrapper>
      <StyledLabel>Price group</StyledLabel>
      {priceGroupsLoading ?
        <Spinner size={2} wrapStyle={{ position: 'relative', left: '25%', top: 15 }} />
        : (
          <Field
            name="priceGroupId"
            component={ReactSelectAdapter}
            options={filteredPriceGroups.map(priceGroup => ({
              value: get(priceGroup, 'node.id'),
              label: join(map(split(get(priceGroup, 'node.name'), ' '), capitalize), ' '),
            }))}
          />
        )
      }
    </StyledFormGroupWrapper>
  )
}

PriceGroupsFilterPure.propTypes = {
  priceGroupData: PropTypes.object,
}

const PriceGroupsFilter = compose(
  withVenueID,
  withPriceGroupProductsFilter(),
)(PriceGroupsFilterPure)

const ProductFiltersForm = ({
  storeSalesTypes,
  setFilters,
  filters,
  setPage,
}) => {
  const initialValuesMap = {
    active: undefined,
    medicalProducts: undefined,
    nonDiscountableProducts: undefined,
    usablePackagesLowerBound: undefined,
    usablePackagesUpperBound: undefined,
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

  // Sales type sort alphabetically
  const filteredStoreSalesTypes = sortBy(storeSalesTypes, ['name'])

  return (
    <Form
      onSubmit={(values) => {
        // remove falsey values before submitting
        let finalValues = pickBy(values, identity) // todo fix this
        const { finished } = finalValues
        // make finished selection into boolean value
        finalValues = get(finished, 'value') === 'all' ? finalValues = omit(finalValues, ['finished']) : { ...finalValues, finished }
        ReactGA.event({
          category: GATypes.eventCategories.product,
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
                  name="posActive"
                  label="Active products"
                />
              </StyledFormCheckboxWrapper>
              <StyledFormCheckboxWrapper>
                <FormCheckbox
                  name="medicalOnly"
                  label="Medical products"
                />
              </StyledFormCheckboxWrapper>
              <StyledFormCheckboxWrapper>
                <FormCheckbox
                  name="preventDiscount"
                  label="Non-discountable products"
                />
              </StyledFormCheckboxWrapper>
            </InputContainer>
            <InputContainer>
              <StyledFormGroupWrapper>
                <StyledLabel>Product type</StyledLabel>
                <Field
                  name="salesTypes"
                  component={ReactSelectAdapter}
                  isMulti
                  placeholder="All"
                  options={filteredStoreSalesTypes.map(salesType => ({
                        value: get(salesType, 'id'),
                        label: join(map(split(get(salesType, 'name'), ' '), capitalize), ' '),
                      }))}
                />
              </StyledFormGroupWrapper>
              <StyledFormGroupWrapper>
                <StyledLabel>Usable Packages</StyledLabel>
                <AmountFields>
                  <FormTextField
                    type="number"
                    name="usablePackageLowerBound"
                    placeholder="0"
                    min={0}
                    validate={combineValidators(
                        numberValidator,
                        naturalNumberValidator,
                        v =>
                          inRange(0,
                          parseInt(form.getState().values.usablePackageUpperBound, 10)
                          || 99)(parseInt(v, 10)),
                    )}
                  />
                  <div style={{ margin: '0 8px' }}> - </div>
                  <FormTextField
                    type="number"
                    name="usablePackageUpperBound"
                    placeholder="5"
                    validate={combineValidators(
                      numberValidator,
                      naturalNumberValidator,
                      v =>
                        inRange(parseInt(form.getState().values.usablePackageLowerBound, 10)
                        || 0, 99)(parseInt(v, 10)),
                    )}
                  />
                </AmountFields>
              </StyledFormGroupWrapper>
              <PriceGroupsFilter />
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

ProductFiltersForm.propTypes = {
  storeSalesTypes: PropTypes.arrayOf(PropTypes.object),
  setFilters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  filters: PropTypes.object,
}

export default ProductFiltersForm
