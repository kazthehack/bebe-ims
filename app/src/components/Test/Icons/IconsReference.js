import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from 'components/common/display/Icon'
import IconSelection from 'assets/BloomLinearIcons/selection.json'

const { icons } = IconSelection
const names = icons.map(icon => icon.properties.name)

const IconRef = styled.div`
  float: left;
  border: 1px solid gray;
  border-radius: 1em;
  margin: 1em;
  width: 20em;
`

const IconListItem = styled.li`
  margin-bottom: 0.5em;
`

const LargeIcon = styled(Icon)`
  font-size: 3em;
`

const MediumIcon = styled(Icon)`
  font-size: 2em;
`

const SmallIcon = styled(Icon)`
  font-size: 1em;
`

const IconItem = ({ name }) => (
  <IconRef>
    <ul>
      <IconListItem>Name: <b>{name}</b></IconListItem>
      <IconListItem><SmallIcon name={name} /></IconListItem>
      <IconListItem><MediumIcon name={name} /></IconListItem>
      <IconListItem><LargeIcon name={name} /></IconListItem>
    </ul>
  </IconRef>
)

IconItem.propTypes = {
  name: PropTypes.string,
}

const IconsReference = () => (
  <div>
    {names.map(n => <IconItem key={n} name={n} />)}
  </div>
)

export default IconsReference
