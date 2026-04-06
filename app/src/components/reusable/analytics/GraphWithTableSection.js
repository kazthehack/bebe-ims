import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const Header = styled.div`
  margin-bottom: 10px;
`

const Title = styled.h3`
  margin: 0;
  color: #243648;
  font-size: 16px;
`

const Subtitle = styled.div`
  margin-top: 4px;
  color: #607589;
  font-size: 12px;
`

const ChartBox = styled.div`
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #f6f9fc;
  padding: 10px;
  margin-bottom: 12px;
`

const Bars = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 8px;
  align-items: end;
  min-height: ${({ $height }) => $height}px;
`

const BarCol = styled.div`
  display: grid;
  gap: 5px;
  justify-items: center;
`

const BarValue = styled.div`
  color: #334a60;
  font-size: 11px;
  font-weight: 600;
`

const Bar = styled.div`
  width: 100%;
  max-width: 34px;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, #3b6a96 0%, #25384c 100%);
  height: ${({ $height }) => `${$height}px`};
  min-height: 4px;
`

const BarLabel = styled.div`
  color: #607589;
  font-size: 11px;
`

const Empty = styled.div`
  border: 1px dashed #d3dce7;
  border-radius: 4px;
  padding: 10px;
  color: #607589;
  font-size: 13px;
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
  min-height: 42px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const GraphWithTableSection = ({
  title,
  subtitle,
  graphHeight,
  series,
  columns,
  rows,
  emptyChartText,
  emptyTableText,
}) => {
  const maxValue = useMemo(
    () => Math.max(...series.map(point => Number(point.value || 0)), 0),
    [series],
  )
  const template = columns.map(column => column.width || '1fr').join(' ')

  return (
    <Section>
      <Header>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Header>

      <ChartBox>
        {series.length === 0 && <Empty>{emptyChartText}</Empty>}
        {series.length > 0 && (
          <Bars $count={series.length} $height={graphHeight}>
            {series.map(point => {
              const value = Number(point.value || 0)
              const height = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * graphHeight)) : 4
              return (
                <BarCol key={point.label}>
                  <BarValue>{value}</BarValue>
                  <Bar $height={height} />
                  <BarLabel>{point.label}</BarLabel>
                </BarCol>
              )
            })}
          </Bars>
        )}
      </ChartBox>

      <Table>
        <HeaderRow $template={template}>
          {columns.map(column => <Cell key={column.key}>{column.label}</Cell>)}
        </HeaderRow>
        {rows.length > 0 && rows.map(row => (
          <BodyRow key={row.key} $template={template}>
            {columns.map(column => <Cell key={`${row.key}-${column.key}`}>{row[column.key]}</Cell>)}
          </BodyRow>
        ))}
        {rows.length === 0 && <Empty>{emptyTableText}</Empty>}
      </Table>
    </Section>
  )
}

GraphWithTableSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  graphHeight: PropTypes.number,
  series: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  })),
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    width: PropTypes.string,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
  })),
  emptyChartText: PropTypes.string,
  emptyTableText: PropTypes.string,
}

GraphWithTableSection.defaultProps = {
  title: 'Insights',
  subtitle: '',
  graphHeight: 140,
  series: [],
  rows: [],
  emptyChartText: 'No chart data yet.',
  emptyTableText: 'No table data yet.',
}

export default GraphWithTableSection
