import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 0;
`

const TabBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0;
  border-bottom: 1px solid #d6dde6;
  background: #eef2f7;
  padding: 0 14px;
  overflow-x: auto;
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
  white-space: nowrap;
`

const TabPanel = styled.div`
  padding: 14px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const ToolbarSlot = styled.div`
  margin-bottom: 12px;
`

const SearchInput = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  min-width: 280px;
  padding: 0 10px;
  background: #f0f3f6;

  @media (max-width: 1024px) {
    min-width: 0;
    width: 100%;
  }
`

const PrimaryButton = styled.button`
  height: 38px;
  border: 1px solid #25384c;
  background: #25384c;
  color: #fff;
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const ListPageShell = ({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  primaryActionLabel,
  onPrimaryAction,
  toolbar,
  children,
}) => (
  <Surface>
    <TabBar role="tablist" aria-label="list workspace tabs">
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          type="button"
          $active={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabBar>
    <TabPanel>
      {toolbar ? (
        <ToolbarSlot>{toolbar}</ToolbarSlot>
      ) : (
        <Toolbar>
          <SearchInput
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
          {primaryActionLabel && onPrimaryAction && (
            <div>
              <PrimaryButton type="button" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </PrimaryButton>
            </div>
          )}
        </Toolbar>
      )}
      {children}
    </TabPanel>
  </Surface>
)

ListPageShell.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  primaryActionLabel: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  toolbar: PropTypes.node,
  children: PropTypes.node.isRequired,
}

export default ListPageShell
