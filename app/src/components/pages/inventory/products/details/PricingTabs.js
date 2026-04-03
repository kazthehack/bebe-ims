import React, { useState } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { get, set } from 'lodash'
import { SingleRowPricingTable, PricingTable } from 'components/PricingTable'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import { SearchListFieldWrapper } from 'components/SearchList'
import Search from 'components/common/input/Search'
import Subheader from 'components/common/display/Subheader'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { updateValuesOnMedicalSameChecked } from 'utils/priceGroup'
import { pricingScheme, recreationalPricing, medicalPricing, medicalSame, customPricing } from 'constants/TooltipMessages'

const flowerConstMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med',
  TAX: 'tax',
  ACTIVE: 'active',
}

const singleRowConstMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med[0]',
  TAX: 'tax',
  AMOUNT: 'quantityAmount',
}

const MimicSubheader = styled.div`
  padding: 0 0 0.4rem 0;
  margin: 0 0 0.8rem 0;
  color: ${colors.grayDark2};
  display: inline-block;
`

const SchemeDiv = styled.div`
  margin-left: 24px;
  color: ${colors.blueishGray};
  display: inline-block;
`

const SearchDiv = styled.div`
  width: 224px;
  max-height: 384px;
  overflow: auto;
  margin-right: 48px;
`

const StyledSearch = styled(Search)`
  width: 224px;
  max-width: none;
`

export const singleRowTabs = ({ preScheme, form, values, canna, userPermissions, archived }) => (
  [{
    text: 'Pricing',
    comp: (
      <>
        {!values.medicalOnly &&
          <SingleRowRecreationalPricingTable
            canna={canna}
            preScheme={preScheme}
            form={form}
            values={values}
            userPermissions={userPermissions}
            archived={archived}
          />
        }
        {canna &&
          <>
            {!values.medicalOnly &&
              <div style={{ margin: '16px 0 0 16px' }}>
                <FormCheckbox
                  name="customPG.portalMedicalSame"
                  label="Use the same base prices for medical patients"
                  tooltip={medicalSame}
                  labelStyle={{ color: colors.grayDark2 }}
                  disabled={archived}
                  onChange={(e) => {
                    const oldValue = e.target.value
                    if (oldValue === 'false') {
                      updateValuesOnMedicalSameChecked({
                        valuePath: 'customPG.prices.rec[0]',
                        changeForm: form.change,
                        values,
                        tax: get(values, 'tax.med'),
                        preScheme,
                        single: true,
                        constMap: singleRowConstMap,
                      })
                    }
                  }}
                />
              </div>
            }
            <SingleRowMedicalPricingTable
              values={values}
              preScheme={preScheme}
              form={form}
              userPermissions={userPermissions}
              archived={archived}
            />
          </>
        }
      </>
    ),
  }]
)

const SingleRowRecreationalPricingTable = ({
  // eslint-disable-next-line react/prop-types
  canna, preScheme, form, values, userPermissions, archived,
}) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {canna ?
        <Subheader
          textSizeOption={2}
          color={colors.blueishGray}
          style={{ marginTop: '0', padding: '0 1.6rem 0.4rem 0' }}
        >
          RECREATIONAL CUSTOMER PRICING
          <TooltipWithIcon text={recreationalPricing} />
        </Subheader>
      :
        <div>{' '}</div> // TODO: something needs to be here to offset space-between. Simplier?
      }
      <MimicSubheader>
        Pricing Scheme
        <SchemeDiv>
          {preScheme ? 'Traditional pricing (pre-tax)' : 'Inclusive pricing (post-tax)'}
          <TooltipWithIcon
            text={pricingScheme}
          />
        </SchemeDiv>
      </MimicSubheader>
    </div>
    <SingleRowPricingTable
      pre={preScheme}
      customerType="RECREATIONAL"
      form={form}
      values={values}
      table="customPG.prices.rec[0]"
      canna={canna}
      userPermissions={userPermissions}
      archived={archived}
    />
  </>
)

const SingleRowMedicalPricingTable = ({
  // eslint-disable-next-line react/prop-types
  values, preScheme, form, userPermissions, archived,
}) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Subheader
        textSizeOption={2}
        color={colors.blueishGray}
        style={values.medicalOnly ? { marginTop: '0', padding: '0 1.6rem 0.4rem 0px' } : undefined}
      >
        MEDICAL PATIENT PRICING
        <TooltipWithIcon text={medicalPricing} />
      </Subheader>
      {values.medicalOnly &&
        <MimicSubheader>
          Pricing Scheme
          <SchemeDiv>
            {preScheme ? 'Traditional pricing (pre-tax)' : 'Inclusive pricing (post-tax)'}
            <TooltipWithIcon
              text={pricingScheme}
            />
          </SchemeDiv>
        </MimicSubheader>
      }
    </div>
    <SingleRowPricingTable
      pre={preScheme}
      customerType="MEDICAL"
      form={form}
      values={values}
      table="customPG.prices.med[0]"
      canna
      userPermissions={userPermissions}
      archived={archived}
      uneditable={values.customPG.portalMedicalSame && !values.medicalOnly}
    />
  </>
)

// eslint-disable-next-line react/prop-types
const PGList = ({ priceGroupList, values, form }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredList = searchTerm ? priceGroupList.filter(e => `${e.name}`.toLowerCase().includes(`${searchTerm}`.toLowerCase())) : priceGroupList
  return (
    <div>
      <StyledSearch onSearch={e => setSearchTerm(`${e}`)} />
      <SearchDiv>
        <SearchListFieldWrapper
          name="selectedPG"
          style={{ border: 'none', margin: '0' }}
          list={filteredList.length ? filteredList : priceGroupList}
          overrideOnChange
          validate={val => (get(val, 'id') ? undefined : 'Please select a custom or shared price group')}
          onChange={(val) => {
            setSearchTerm('')
            if (val.id === values.customPG.id) form.change('selectedPG', values.customPG)
            else form.change('selectedPG', val)
          }}
          noUnselect
        />
      </SearchDiv>
    </div>
  )
}

export const flowerTabs = ({
  preScheme,
  form,
  values,
  priceGroupList,
  userPermissions,
  archived,
}) => [{
  text: 'Price Group',
  onSelect: () => {
    set(values.customPG, 'hidden', false)
    form.change('selectedPG', values.customPG)
  },
  comp: (
    <div style={{ display: 'flex' }}>
      {!archived &&
        <PGList priceGroupList={priceGroupList} values={values} form={form} />
      }
      <div style={{ width: '100%' }}>
        {!values.medicalOnly &&
          <RecreationaTableHeader pgName={get(values, 'selectedPG.name')} />
        }
        {!values.medicalOnly &&
          <>
            <PricingTable
              uneditable
              pre={preScheme}
              changeForm={form.change}
              values={values}
              table={'selectedPG.prices.rec'}
              tax={get(values, 'tax.rec')}
              medTax={get(values, 'tax.med')}
              userPermissions={userPermissions}
              portalMedicalSame={get(values, 'selectedPG.portalMedicalSame')}
            />
            <div style={{ margin: '16px 0 0 16px' }}>
              <FormCheckbox
                name="selectedPG.portalMedicalSame"
                label="Use the same base prices for medical patients"
                tooltip={medicalSame}
                labelStyle={{ color: colors.grayDark2 }}
                disabled
              />
            </div>
          </>
        }
        <MedicalPatientPricingTable
          uneditable
          values={values}
          preScheme={preScheme}
          changeForm={form.change}
          userPermissions={userPermissions}
          portalMedicalSame={get(values, 'selectedPG.portalMedicalSame')}
          archived={archived}
          tableKey={'selectedPG.prices.med'}
        />
      </div>
    </div>
  ),
}, {
  text: 'Custom Pricing',
  onSelect: () => {
    set(values.customPG, 'hidden', false)
    form.change('selectedPG', values.customPG)
  },
  comp: (
    <>
      {!values.medicalOnly &&
        <div style={{ margin: '16px 0 0 16px' }}>
          <RecreationalPricingTableForCustomPricing
            values={values}
            preScheme={preScheme}
            changeForm={form.change}
            userPermissions={userPermissions}
            archived={archived}
            portalMedicalSame={get(values, 'customPG.portalMedicalSame')}
          />
        </div>
      }
      <MedicalPatientPricingTable
        values={values}
        preScheme={preScheme}
        changeForm={form.change}
        userPermissions={userPermissions}
        archived={archived}
        portalMedicalSame={get(values, 'customPG.portalMedicalSame')}
      />
    </>
  ),
}]

// eslint-disable-next-line react/prop-types
const RecreationaTableHeader = ({ pgName, preScheme }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: '0 1.6rem 0 0',
      marginBottom: '0.8rem',
    }}
  >
    <div>
      {!preScheme &&
        <Subheader
          textSizeOption={2}
          color={colors.grayDark2}
          style={{ marginTop: '0', marginBottom: '0', padding: '0 1.6rem 0.4rem 0px' }}
        >
          {pgName}
        </Subheader>
      }
      <Subheader
        textSizeOption={2}
        color={colors.blueishGray}
        style={{ marginTop: '5px', marginBottom: '0', padding: '0 1.6rem 0.4rem 0px' }}
      >
        RECREATIONAL CUSTOMER PRICING
        <TooltipWithIcon
          text={preScheme ?
            <div>
              {customPricing}
              <br /><br />
              {recreationalPricing}
            </div> :
            recreationalPricing
          }
        />
      </Subheader>
    </div>
    {preScheme &&
      <div>
        <MimicSubheader>
          Pricing Scheme
          <SchemeDiv>
            {preScheme ? 'Traditional pricing (pre-tax)' : 'Inclusive pricing (post-tax)'}
            <TooltipWithIcon
              text={pricingScheme}
            />
          </SchemeDiv>
        </MimicSubheader>
      </div>
    }
  </div>
)

const RecreationalPricingTableForCustomPricing = ({
  // eslint-disable-next-line react/prop-types
  values, preScheme, changeForm, userPermissions, archived, portalMedicalSame,
}) => (
  <>
    <RecreationaTableHeader preScheme={preScheme} pgName={values.selectedPG.name} />
    <PricingTable
      pre={preScheme}
      changeForm={changeForm}
      values={values}
      table="customPG.prices.rec"
      tax={get(values, 'tax.rec')}
      medTax={get(values, 'tax.med')}
      userPermissions={userPermissions}
      archived={archived}
      portalMedicalSame={portalMedicalSame}
    />
    <div style={{ margin: '16px 0 0 16px' }}>
      <FormCheckbox
        name="customPG.portalMedicalSame"
        label="Use the same base prices for medical patients"
        tooltip={medicalSame}
        labelStyle={{ color: colors.grayDark2 }}
        disabled={archived}
        onChange={(e) => {
          const oldValue = e.target.value
          if (oldValue === 'false') {
            updateValuesOnMedicalSameChecked({
              valuePath: 'customPG.prices.rec',
              changeForm,
              values,
              tax: values.tax.med,
              preScheme,
              constMap: flowerConstMap,
            })
          }
        }}
      />
    </div>
  </>
)

const MedicalPatientPricingTable = ({
  // eslint-disable-next-line react/prop-types
  values, preScheme, changeForm, userPermissions, archived, uneditable, tableKey, portalMedicalSame,
}) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Subheader
        textSizeOption={2}
        color={colors.blueishGray}
        style={values.medicalOnly ? { marginTop: '0', padding: '0 1.6rem 0.4rem 0px' } : undefined}
      >
        MEDICAL PATIENT PRICING
        <TooltipWithIcon text={medicalPricing} />
      </Subheader>
    </div>
    <PricingTable
      pre={preScheme}
      changeForm={changeForm}
      values={values}
      table={tableKey || 'customPG.prices.med'}
      tax={get(values, 'tax.rec')}
      medTax={get(values, 'tax.med')}
      userPermissions={userPermissions}
      archived={archived}
      uneditable={uneditable || (portalMedicalSame && !values.medicalOnly)}
      portalMedicalSame={portalMedicalSame}
    />
  </>
)
