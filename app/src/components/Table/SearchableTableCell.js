/* eslint-disable react/prop-types */
import React from 'react'
import { escapeRegExp } from 'lodash'
import styled from 'styled-components'

const SpanTooltip = styled.span`
  &.tooltip:after,
  &.tooltip:before {
    position: absolute;
    font-size: 12px;
    margin-top: 20px;
    padding: 5px;
    opacity: 0;
    visibility: hidden;
  }
  &.tooltip:before {
    content: attr(data-title);
    background-color: rgb(31, 47, 69);
    color: #FFF;
  }
  &.tooltip:after {
    content: "";
  }
  &.tooltip:hover:after,
  &.tooltip:hover:before {
    visibility: visible;
    opacity: 1;
    transition: .25s all ease;
    transition-delay: 0.3s;
  }
`

const HighlightedText = ({ text, highlight, style, hasTooltip }) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'))
  const coconuts = parts.map((part, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={i} style={part.toLowerCase() === `${highlight}`.toLowerCase() ? { ...style, color: 'white', backgroundColor: '#1875f0' } : style}>
      { part }
    </span>
  ))

  return (
    <SpanTooltip className={hasTooltip ? 'tooltip' : ''} data-title={text}>
      { coconuts }
    </SpanTooltip>
  )
}

/** Only use this functional component for cells that you wish to have a highligted text on search
 * @function SearchableCellText
 * @param text fill this up if only show simple text ( This will take priority )
 */
const SearchableCellText = ({ text = '', style, table, hasTooltip = true }) => {
  if (text) {
    if (table) {
      const { result, searchTerm } = table
      if (result && result.length) {
        return (
          <HighlightedText
            hasTooltip={hasTooltip}
            text={text}
            highlight={searchTerm}
            style={style}
          />
        )
      }
    }
  }

  return text && (
    <SpanTooltip
      style={style}
      className={hasTooltip ? 'tooltip' : ''}
      data-title={text}
    >
      {text}
    </SpanTooltip>
  )
}

export default SearchableCellText
