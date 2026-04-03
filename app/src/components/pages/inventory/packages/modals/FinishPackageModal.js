// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import ReactGA from 'react-ga'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { connectModal } from 'components/Modal'
import { Tooltip } from 'components/common/display'
import withFinishPackage from '../detail/withFinishPackage'

const styles = {
  button: {
    height: '56px',
  },
  footer: {
    height: '56px',
  },
}

const ConnectedButtonModal = connectModal('FinishPackageModal')(ButtonModal)

const FinishPackageModal = ({
  pushModal,
  popModal,
  quantity,
  finishPackage,
  disabled,
  metrcReadOnly,
  packageId,
}) => {
  const unable = Number(quantity) > 0
  return (
    <Fragment>
      {metrcReadOnly && <Button primary disabled>Finish Package</Button>}

      {!metrcReadOnly &&
        <Tooltip text="This package has already been finished. To make changes, please log in to Metrc and un-finish the package there." disabled={!disabled}>
          <Button primary disabled={disabled} onClick={() => pushModal('FinishPackageModal')}>Finish Package</Button>
        </Tooltip>
      }
      <ConnectedButtonModal
        title={unable ? 'Cannot Finish Package' : 'Confirm package finish'}
        header={unable ? 'Package cannot be finished' : 'Confirm package finish'}
        primaryButton={unable ?
          { text: 'adjust quantity', onClick: () => { popModal(); pushModal('AdjustQuantityModal') } } :
          {
            text: 'finish package',
            onClick: (...props) => {
              ReactGA.event({
                category: GATypes.eventCategories.package,
                action: GATypes.eventActions.finished,
                label: packageId,
              })
              finishPackage(...props)
            },
          }
        }
        secondaryButton={{ text: 'cancel', onClick: popModal }}
        contentStyle={{ content: { marginTop: '40px', marginBottom: '40px', maxWidth: '454px' } }}
        footerStyle={styles}
      >
        {unable ?
          'This package’s quantity is not zero and therefore cannot be finished. Would you like to adjust the quantity now?'
          : 'Are you sure you want to finish this package? This will mark its status as inactive.'
        }
      </ConnectedButtonModal>
    </Fragment>
  )
}

FinishPackageModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  quantity: PropTypes.string.isRequired,
  finishPackage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  metrcReadOnly: PropTypes.bool,
  packageId: PropTypes.string,
}

export default withFinishPackage(FinishPackageModal)
