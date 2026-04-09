import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4d4d4d;
  font: 500 26px 'Roboto', sans-serif;
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

const CrumbButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  color: #5c6f84;
  font: inherit;
  cursor: pointer;

  &:hover {
    color: #25384c;
    text-decoration: underline;
  }
`

const labelOf = (item) => (typeof item === 'string' ? item : item.label)
const toOf = (item) => (typeof item === 'string' ? null : item.to || null)
const onClickOf = (item) => (typeof item === 'string' ? null : item.onClick || null)

const BreadcrumbTitle = ({ items }) => (
  <Wrap>
    {items.map((item, index) => {
      const isLast = index === items.length - 1
      const label = labelOf(item)
      const to = toOf(item)
      const onClick = onClickOf(item)
      return (
        <React.Fragment key={`${label}-${index}`}>
          {isLast ? <Current>{label}</Current> : (
            to
              ? <CrumbLink to={to}>{label}</CrumbLink>
              : (onClick ? <CrumbButton type="button" onClick={onClick}>{label}</CrumbButton> : <span>{label}</span>)
          )}
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
      onClick: PropTypes.func,
    }),
  ])).isRequired,
}

export default BreadcrumbTitle
