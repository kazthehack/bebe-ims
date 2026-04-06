import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: #fff;
  border: 1px solid #dde4ee;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(20, 38, 63, 0.08);
  padding: 16px;
`

const CardTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 15px;
  color: #1f2f45;
`

const CardItem = styled.div`
  font-size: 13px;
  color: #4d4d4d;
  padding: 6px 0;
  border-bottom: 1px dashed #e7edf5;

  &:last-child {
    border-bottom: 0;
  }
`

const Lead = styled.p`
  margin: 0 0 16px;
  color: #5e5e5e;
  font-size: 14px;
`

const ModuleOverviewPage = ({
  title,
  description,
  objects,
  actions,
  workflows,
}) => {
  return (
    <PageContent
      title={(
        <div>
          {title}
        </div>
      )}
    >
      <Lead>{description}</Lead>
      <Grid>
        <Card>
          <CardTitle>Core Objects</CardTitle>
          {objects.map(item => (
            <CardItem key={item}>{item}</CardItem>
          ))}
        </Card>
        <Card>
          <CardTitle>Core Actions</CardTitle>
          {actions.map(item => (
            <CardItem key={item}>{item}</CardItem>
          ))}
        </Card>
        <Card>
          <CardTitle>Workflow Backbone</CardTitle>
          {workflows.map(item => (
            <CardItem key={item}>{item}</CardItem>
          ))}
        </Card>
      </Grid>
    </PageContent>
  )
}

ModuleOverviewPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  objects: PropTypes.arrayOf(PropTypes.string).isRequired,
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  workflows: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ModuleOverviewPage
