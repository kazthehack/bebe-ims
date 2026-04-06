import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0;
  color: #243648;
  font-size: 16px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $template }) => $template};
  padding: 0 10px;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
`

const BodyRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $template }) => $template};
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #eef2f6;
  align-items: center;
  min-height: 46px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const Empty = styled.div`
  padding: 10px;
  border: 1px dashed #d3dce7;
  border-radius: 4px;
  color: #607589;
  font-size: 13px;
`

const RelatedObjectsTableSection = ({ title, actions, columns, rows, loadingText, emptyText }) => {
  const template = columns.map(column => column.width || '1fr').join(' ')

  return (
    <Section>
      <Header>
        {title && <SectionTitle>{title}</SectionTitle>}
        {actions}
      </Header>
      <Table>
        <HeaderRow $template={template}>
          {columns.map(column => <Cell key={column.key}>{column.label}</Cell>)}
        </HeaderRow>
        {rows.length > 0 && rows.map((row) => (
          <BodyRow key={row.key} $template={template}>
            {columns.map(column => <Cell key={`${row.key}-${column.key}`}>{row[column.key]}</Cell>)}
          </BodyRow>
        ))}
        {rows.length === 0 && <Empty>{loadingText || emptyText}</Empty>}
      </Table>
    </Section>
  )
}

RelatedObjectsTableSection.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    width: PropTypes.string,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
  })),
  loadingText: PropTypes.string,
  emptyText: PropTypes.string,
}

RelatedObjectsTableSection.defaultProps = {
  title: '',
  actions: null,
  rows: [],
  loadingText: '',
  emptyText: 'No related records.',
}

export default RelatedObjectsTableSection
