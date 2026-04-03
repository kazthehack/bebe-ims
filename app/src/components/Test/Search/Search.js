//  Copyright (c) 2019 First Foundry Inc. All rights reserved.
// eslint-disable
import React, { Fragment } from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import { compose, withProps } from 'recompose'
import { TableSearchField } from 'components/Table'
import Title from 'components/common/display/Title'
import { Form, Field } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import PropTypes from 'prop-types'
import { FormTextField } from 'components/common/input/TextField'
import smartSearch from 'utils/search'
import { TEST_DATA, TEST_SEARCH_OBJECT } from './TestData'

const Wrapper = styled.div`
  margin: auto;
  margin-left: 16px;
  margin-right: 16px;
`

const StyledLabel = styled.label`
  display: block
`

const FormField = styled.div`
  margin: 0px 10px;
`

/* Perform a Fuzzy Search */
const woThresholdOptions = {
  shouldSort: true,
  /* TODO: record matched field for searches
   * includeMatches: true, // will return the matched field, and indices, etc.
   */
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
}

const fuzzyOptions = threshold => (
  {
    ...woThresholdOptions,
    threshold,
  }
)

const StyledFormField = styled(FormTextField)`

`

const Div = styled.div`
  margin-top: -20px;
  margin-left: 20px;
`

const SearchTest = ({ search, initialValues }) => (
  <Wrapper>
    <Form
      onSubmit={search}
      initialValues={initialValues}
      decorators={[focusOnError]}
      render={({ form, values }) => (
        <Fragment>
          <Title>{'Smart Search Test'}</Title>
          <form onSubmit={(e) => {
            e.preventDefault()
          }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <TableSearchField
                  name="searchTerm"
                  onSearch={(val) => {
                    const resultData = search(
                      val,
                      JSON.parse(values.searchObject), JSON.parse(values.data),
                      fuzzyOptions(values.threshold),
                    )
                    form.change('result', JSON.stringify(resultData))
                  }}
                />
                {values.result &&
                <div>{JSON.parse(get(values, 'result', [])).length} results found</div>
                }
              </div>
              <Div>
                <label>Fuzzy Search Threshold</label>
                <StyledFormField
                  placeholder=".4 (from 0-1)"
                  name="threshold"
                  type="number"
                  min="0.00"
                  max="1.0"
                  step="0.1"
                />
              </Div>
            </div>
            <div
              style={{
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Field
                name="searchObject"
                render={({ input, meta }) => (
                  <FormField>
                    <StyledLabel>Search Object</StyledLabel>
                    <textarea
                      name="searchObject"
                      cols="75"
                      style={{ height: '200px', marginTop: 10 }}
                      {...input}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </FormField>
                )}
              />
              <Field
                name="data"
                render={({ input, meta }) => (
                  <FormField>
                    <div>Data</div>
                    <textarea
                      name="data"
                      cols="90"
                      style={{ height: '500px', marginTop: 10 }}
                      {...input}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </FormField>
                )}
              />
              <Field
                name="result"
                render={({ input, meta }) => (
                  <FormField>
                    <div>Result</div>
                    <textarea
                      name="result"
                      cols="90"
                      style={{ height: '500px', marginTop: 10 }}
                      {...input}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </FormField>
                )}
              />
            </div>
          </form>
        </Fragment>
      )}
    />
  </Wrapper>
)

SearchTest.propTypes = {
  search: PropTypes.func,
  initialValues: PropTypes.object,
}

export default compose(
  withProps(() => ({
    search: smartSearch,
    initialValues: {
      data: JSON.stringify(TEST_DATA),
      searchObject: JSON.stringify(TEST_SEARCH_OBJECT),
      searchTerm: '',
      threshold: 0.4,
    },
  })),
)(SearchTest)
