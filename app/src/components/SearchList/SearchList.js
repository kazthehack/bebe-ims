import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import { Field } from 'react-final-form'
import { noop, get } from 'lodash'

const List = styled.div`
  width: 100%;
  border: solid 1px ${colors.grayLight};
  border-radius: 2px;
  margin-top: 8px;
  overflow: auto;
`

const ItemDiv = styled.div`
  height: 32px;
  line-height: 32px;
  background-color: ${props => (props.selected ? colors.blue : colors.white)};
  color: ${props => (props.selected ? colors.white : colors.grayDark2)};
  padding: 0 8px 0 8px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const ListItem = ({ text, onClick, selected, style, value }) => (
  <ItemDiv style={style} selected={selected} onClick={onClick} data-value={value}>{text}</ItemDiv>
)

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.string,
}

// TODO: Update to handle real data, add search actually inside this component
export class SearchList extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selected: props.defaultValue,
    }
    this.select = this.select.bind(this)
  }

  select = (val) => {
    if (this.props.value) {
      if (val === this.props.value.id) {
        if (!this.props.noUnselect) {
          this.setState({ selected: {} })
        }
      } else {
        this.setState({ selected: this.props.list.find(listItem => (listItem.id === val)) })
      }
    } else if (val === this.state.selected.id) {
      if (!this.props.noUnselect) {
        this.setState({ selected: {} })
      }
    } else {
      this.setState({ selected: this.props.list.find(listItem => (listItem.id === val)) })
    }
  }

  render() {
    return (
      <List style={this.props.style}>
        {this.props.list.map((item) => {
          if (item.hidden) return undefined
          return (
            <ListItem
              style={this.props.itemStyle}
              text={item.name}
              key={item.id}
              selected={this.props.value ? this.props.value.id === item.id : (get(this.state.selected, 'id', '') === item.id)}
              value={item.id}
              onClick={(e) => {
                const val = e.target.getAttribute('data-value')
                this.select(val)
                if (this.props.value) {
                  if (val === this.props.value.id) {
                    if (!this.props.noUnselect) {
                      this.props.onChange({})
                    }
                  } else {
                    this.props.onChange(this.props.list.find(listItem => (listItem.id === val)))
                  }
                } else if (val === this.state.selected.id) {
                  if (!this.props.noUnselect) {
                    this.props.onChange({})
                  }
                } else {
                  this.props.onChange(this.props.list.find(listItem => (listItem.id === val)))
                }
              }}
            />
          )
        })}
      </List>
    )
  }
}

SearchList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  itemStyle: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  noUnselect: PropTypes.bool,
}

SearchList.defaultProps = {
  onChange: noop,
}

export const SearchListFieldWrapper = ({
  name,
  onChange = noop,
  validate,
  overrideOnChange = false,
  ...props
}) => (
  <Field
    name={name}
    validate={validate}
    render={({ input }) => (
      <SearchList
        {...input}
        {...props}
        onChange={(e) => {
          if (!overrideOnChange) input.onChange(e)
          onChange(e)
        }}
      />
    )}
  />
)

SearchListFieldWrapper.propTypes = {
  overrideOnChange: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  validate: PropTypes.func,
}
