import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'
import { FormSelectField } from 'components/common/input/SelectField'

const StyledFormGroup = styled.div`
  display: flex;
  margin: 12px auto;
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
  width: 550px;
  label {
    flex: 3 0 30%;
    color: ${colors.grayDark2};
    max-width: 8.5rem;
    display: inline-block;
  }

  :last-of-type {
    margin-bottom: 10px;
  }
`

const StyledToggleForm = styled.div`
  display: flex;
  margin: 12px auto;
  margin-bottom: 24px;
  justify-content: flex-start;
  width: 550px;
  align-items: center;
  label {
    min-width: 208px;
    max-width: 262px;
    color: ${colors.grayDark2};
    display: inline-block;
  }
`

const Styledlabel = styled.label`
  width: 120px;
  height: auto;
  font-size: 14px;
  white-space: break-spaces;
  && {
    max-width: unset;
  }
`

const StyledToggleLabel = styled.label`
  width: 120px;
  height: 16px;
  font-size: 14px;
  margin-right: 80px;
`

const BarcodePriceField = ({
  flower,
  canna,
  type,
  form,
  price,
  setPrePkgd,
  setWeight,
  setPrice,
  weightList,
  prepackaged,
}) => {
  useEffect(() => {
    if (!price) {
      setPrice(weightList[0].value)
    }
  }, [price])
  return (
    <>
      {flower && (
        <StyledToggleForm>
          <StyledToggleLabel>Pre-packaged</StyledToggleLabel>
          <FormToggle
            name="prepackaged"
            value={prepackaged}
            onChange={(e) => {
              if (e.target.value === 'false') {
                setWeight('1')
              } else {
                setWeight('0')
              }
              setPrePkgd(prevState => !prevState)
            }}
          />
        </StyledToggleForm>
      )}
      { canna && (
        <>
          { flower &&
            <StyledFormGroup>
              <Styledlabel>Weight {prepackaged}</Styledlabel>
              <FormSelectField
                options={prepackaged ? weightList : [
                  { name: 'N/A', value: 'N/A' },
                ]}
                name="weight"
                onChange={(e) => {
                  form.change('price', e.target.value)
                  setPrice(e.target.value)
                  const index = e.nativeEvent.target.selectedIndex
                  setWeight(e.nativeEvent.target[index].text)
                }}
                suffix="G"
                disabled={!prepackaged}
                fieldContainerStyle={{ width: '258px' }}
              />
            </StyledFormGroup>
          }
          <StyledFormGroup>
            <Styledlabel>{type} price</Styledlabel>
            <FormTextField
              name="price"
              prefix="$"
              fieldContainerStyle={{ width: '258px' }}
              disabled
              value={prepackaged || !flower ? price : 'N/A'}
            />
          </StyledFormGroup>
        </>
      )}
      {!canna &&
        <StyledFormGroup>
          <Styledlabel>{type} price</Styledlabel>
          <FormTextField
            name="price"
            prefix="$"
            fieldContainerStyle={{ width: '258px' }}
            disabled={!prepackaged}
            value={price}
          />
        </StyledFormGroup>
      }
    </>
  )
}

BarcodePriceField.propTypes = {
  flower: PropTypes.bool,
  prepackaged: PropTypes.bool,
  type: PropTypes.string,
  form: PropTypes.object,
  canna: PropTypes.bool,
  setPrePkgd: PropTypes.func,
  setWeight: PropTypes.func,
  setPrice: PropTypes.func,
  price: PropTypes.string,
  weightList: PropTypes.arrayOf(PropTypes.object),
}

export default BarcodePriceField
