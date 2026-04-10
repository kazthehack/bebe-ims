import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TabBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0;
  border-bottom: 1px solid #d6dde6;
  background: #eef2f7;
  padding: 0 14px;
`

const TabButton = styled.button`
  border: 0;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#25384c' : 'transparent')};
  background: transparent;
  color: ${({ $active }) => ($active ? '#25384c' : '#5c6f84')};
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  letter-spacing: 0.02em;
  height: 46px;
  padding: 0 14px;
  cursor: pointer;
`

const WorkspaceTabs = ({ tabs, activeTab, onChange, ariaLabel }) => (
  <TabBar role="tablist" aria-label={ariaLabel}>
    {(tabs || []).map((tab) => (
      <TabButton
        key={tab.key}
        id={`${tab.key}-tab`}
        role="tab"
        aria-selected={activeTab === tab.key}
        aria-controls={`${tab.key}-panel`}
        type="button"
        $active={activeTab === tab.key}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </TabButton>
    ))}
  </TabBar>
)

WorkspaceTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
}

WorkspaceTabs.defaultProps = {
  ariaLabel: 'Workspace tabs',
}

export default WorkspaceTabs
