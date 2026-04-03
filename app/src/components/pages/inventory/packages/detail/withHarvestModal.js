import React from 'react'
import { compose, withProps } from 'recompose'
import withAlert from 'components/Modal/withAlert'

const contentStyle = {
  content: {
    width: 396, // 474-80 for padding
    marginBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
}

const withHarvestModal = C => compose(
  withAlert(),
  withProps(ownProps => ({
    viewHarvestModal: harvestData => (
      ownProps.alert({
        message: <div>{harvestData.map(name => (<div key={name}>{name}</div>))}</div>,
        title: 'Harvest Names',
        primaryText: 'Close',
        contentStyle,
      })),
  })),
)(C)

export default withHarvestModal
