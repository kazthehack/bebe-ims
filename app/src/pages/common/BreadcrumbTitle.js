import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5c6f84;
  font: 600 14px 'Roboto', sans-serif;
  letter-spacing: 0.02em;
`

const Current = styled.span`
  color: #25384c;
`

const CrumbLink = styled(Link)`
  color: #5c6f84;
  text-decoration: none;

  &:hover {
    color: #25384c;
    text-decoration: underline;
  }
`

const labelOf = (item) => (typeof item === 'string' ? item : item.label)
const toOf = (item) => (typeof item === 'string' ? null : item.to || null)

const BreadcrumbTitle = ({ items }) => (
  <Wrap>
    {items.map((item, index) => {
      const isLast = index === items.length - 1
      const label = labelOf(item)
      const to = toOf(item)
      return (
        <React.Fragment key={`${label}-${index}`}>
          {isLast ? <Current>{label}</Current> : (to ? <CrumbLink to={to}>{label}</CrumbLink> : <span>{label}</span>)}
          {!isLast && <span>/</span>}
        </React.Fragment>
      )
    })}
  </Wrap>
)

BreadcrumbTitle.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    }),
  ])).isRequired,
}

export default BreadcrumbTitle
