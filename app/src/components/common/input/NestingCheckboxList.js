//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormCheckbox } from 'components/common/input/Checkbox'
import AltCheckbox from 'components/common/input/AltCheckbox'
import { some, keyBy, mapValues, get } from 'lodash'
import colors from 'styles/colors'

const rotateStyle = {
  transform: 'rotate(90deg)',
}

const RowDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 20px;
  margin-bottom: 8px;
`

const IndentedDiv = styled.div`
  display: inline-block;
  margin-left: 43px;
  ${props => (props.expanded ? '' : 'display: none;')}
`

const StyledArrow = styled.div`
  position: absolute;
  top: 8px;
  right: 0;
  border-left: 6px solid transparent;
  border-right:  6px solid transparent;
  border-top: 6px solid ${colors.trans.gray72};
  height: 0;
  width: 0;
  float: right;
  display: flex;
  cursor: pointer;
  z-index: 99;
`

class CheckboxGroup extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      expanded: true,
    }
  }

  toggleExpand = () => {
    this.setState(oldState => ({ expanded: !oldState.expanded }))
  }

  render() {
    const {
      name,
      subItems,
      changeFormValue,
      itemValues = {},
      listName,
      collapsible,
      disabled,
    } = this.props
    const isChecked = some(itemValues)
    return subItems.length > 1 ?
      <div>
        <RowDiv>
          <AltCheckbox
            label={name}
            checked={isChecked}
            disabled={disabled}
            partial={isChecked && !subItems.every(item => itemValues[item.id])}
            onChange={() => {
              subItems.forEach(
                item => changeFormValue(
                  `${listName}.${name}.${item.id}`,
                  !isChecked,
                ),
              )
            }}
          />
          {collapsible &&
            <StyledArrow
              style={!this.state.expanded ? rotateStyle : {}}
              onClick={this.toggleExpand}
            />}
        </RowDiv>
        <IndentedDiv expanded={this.state.expanded}>
          {subItems.map(item => (
            <RowDiv key={item.name} >
              <FormCheckbox
                label={item.name}
                name={`${listName}.${name}.${item.id}`}
                disabled={disabled}
              />
            </RowDiv>
          ))}
        </IndentedDiv>
      </div> :
      <RowDiv>
        <FormCheckbox
          label={name}
          name={`${listName}.${name}.${get(subItems, '[0].id')}`}
          disabled={disabled}
        />
      </RowDiv>
  }
}

const SubItemsPropType = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}))

CheckboxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  subItems: SubItemsPropType,
  changeFormValue: PropTypes.func.isRequired,
  itemValues: PropTypes.object,
  listName: PropTypes.string.isRequired,
  collapsible: PropTypes.bool,
  disabled: PropTypes.bool,
}

const NestingCheckboxList = ({
  groups,
  changeFormValue,
  values, // whole values render prop from react-final-form
  name,
  collapsible = false,
  subItemsName,
  disabled,
}) => (
  <Fragment>
    { groups.map(group => (
      <CheckboxGroup
        key={group.id}
        name={group.name}
        subItems={group[subItemsName]}
        changeFormValue={changeFormValue}
        itemValues={(values[name] || {})[group.name]}
        collapsible={collapsible}
        listName={name}
        disabled={disabled}
      />
    )) }
  </Fragment>
)

NestingCheckboxList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  changeFormValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  collapsible: PropTypes.bool,
  subItemsName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export default NestingCheckboxList

/**
 * @function salesCategoriesToCheckboxGroups - Utility to convert salesCategories as returned by
 * withSalesCategories into an object to provide to a NestingCheckboxList
 * @param {object[]} salesCategories array as returned by the withSalesCategories hoc
 * @returns {object} object to provide to a NestingCheckboxList as the groups prop
 */
export const salesCategoriesToCheckboxGroups = salesCategories => salesCategories.map(cat => ({
  name: cat.name,
  subItems: cat.salesTypes.map(({ name, id }) => ({ name: id, label: name })),
}))


/**
 * @function allCheckboxValues - Utility to get an object in the form that that this component would
 * store values with react-final-form, with all values filled in. Helpful for setting default form
 * values.
 * @param {object} groups - the same groups object which would be passed to the NestingCheckboxList
 * @param {boolean} value - the value to set every checkbox to
 */
export const allCheckboxValues = (groups, value = true, salesTypes, subItemName = 'salesTypes') =>
  mapValues(
    keyBy(groups, ({ name }) => name),
    group => mapValues(
      keyBy(group[subItemName], ({ id }) => id),
      (thingValue, key) => {
        if (salesTypes) {
          const found = salesTypes.find(({ id }) => id === key)
          return !!found || value
        }
        return value
      },
    ),
  )

/**
 * @function fromSalesTypes - Utility to get an object in the form that that this component would
 * store values with react-final-form, with the checkboxes for the provided salesTypes set to true
 * and all other values set to false
 * @param {object} groups - the salesCategories as would be passed to this component
 * @param {object[]} salesTypes - array the salesTypes selected, as returned for taxes or
 * compliance limits
 */
export const fromSalesTypes = (groups, salesTypes) =>
  mapValues(
    allCheckboxValues(groups, false), // start with all values turned off
    grouping => mapValues(
      grouping,
      // turn on any values which are found in the provided salesTypes
      (value, key) =>
        some(
          salesTypes,
          givenType => givenType.id === key,
        ),
    ),
  )

/**
 * @function atLeastOneSelected - Utility to determine if at least one checkbox in the list is
 * selected. Helpful for validation.
 * @param {object} values - the form values render prop provided by react-final-form
 * @returns {boolean} - true if at least one checkbox is checked
 */
export const atLeastOneSelected = values =>
  some(values, group => some(group))
