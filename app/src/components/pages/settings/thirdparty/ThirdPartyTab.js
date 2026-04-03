// Copyright (c) 2017-2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'
import { get } from 'lodash'
import { compose } from 'recompose'
import { StyledTitle } from 'components/pages/settings/SettingsStyles'
import BakerLogo from 'assets/images/baker_logo.png'
import DutchieLogo from 'assets/images/dutchie_logo.png'
import JaneLogo from 'assets/images/jane_logo.png'
import LeaflyLogo from 'assets/images/leafly_logo.png'
import MetrcLogo from 'assets/images/metrc_logo.png'
import PayboticLogo from 'assets/images/paybotic_logo.png'
import WeedmapsLogo from 'assets/images/weedmaps_logo.png'
import logo from 'assets/logo.png'
import BakerLogoDisabled from 'assets/images/baker_bw.png'
import DutchieLogoDisabled from 'assets/images/dutchie_bw.png'
import JaneLogoDisabled from 'assets/images/jane_bw.png'
import LeaflyLogoDisabled from 'assets/images/leafly_bw.png'
import MetrcLogoDisabled from 'assets/images/metrc_bw.png'
import PayboticLogoDisabled from 'assets/images/paybotic_bw.png'
import WeedmapsLogoDisabled from 'assets/images/weedmaps_bw.png'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import SettingsNavigation from '../SettingsNavigation'
import ThirdPartytListBox from './partials/ThirdPartyListBox'
import withThirdPartySettings from './withThirdPartySettings'

const Container = styled.div`
  margin-top: 32px;
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
`

const ThirdPartyTab = ({ history, thirdPartySettings }) => {
  const integrationTypes = [
    {
      label: 'METRC',
      src: MetrcLogo,
      srcDisabled: MetrcLogoDisabled,
      route: '/settings/thirdparty/metrc',
      comingSoon: false,
      integrated: true,
      tooltip: 'Metrc is a regulatory framework that enables the government to monitor and enforce compliance.',
    },
    {
      label: 'PAYBOTIC',
      src: PayboticLogo,
      srcDisabled: PayboticLogoDisabled,
      route: '/settings/thirdparty/paybotic',
      comingSoon: false,
      integratedPath: 'posSettings.enablePaybotics',
      tooltip: 'Paybotic supplies custom payment solutions to cannabis merchants, contact your Bloom representative for more info.',
    },
    {
      label: 'BAKER',
      src: BakerLogo,
      srcDisabled: BakerLogoDisabled,
      route: '/',
      comingSoon: true,
      integrated: false,
      hidden: true,
    },
    {
      label: 'LEAFLY',
      src: LeaflyLogo,
      srcDisabled: LeaflyLogoDisabled,
      route: '/settings/thirdparty/leafly',
      comingSoon: false,
      integratedPath: 'integrations.leafly.active',
      hidden: !get(thirdPartySettings, 'store.integrations.leafly.visible', false),
    },
    {
      label: 'WEEDMAPS',
      src: WeedmapsLogo,
      srcDisabled: WeedmapsLogoDisabled,
      route: '/',
      comingSoon: true,
      integrated: false,
      hidden: true,
    },
    {
      label: 'DUTCHIE',
      src: DutchieLogo,
      srcDisabled: DutchieLogoDisabled,
      route: '/',
      comingSoon: true,
      integrated: false,
      hidden: true,
    },
    {
      label: 'I HEART JANE',
      src: JaneLogo,
      srcDisabled: JaneLogoDisabled,
      route: '/',
      comingSoon: true,
      integrated: false,
      hidden: true,
    },
    {
      label: 'BLOOM',
      src: logo,
      integratedPath: 'integrations.onlineMenu.active',
      route: '/settings/thirdparty/bloom-menu',
      comingSoon: false,
      hidden: !get(thirdPartySettings, 'store.integrations.onlineMenu.visible', false),
    },
  ]
  const integrated = (integrationType) => {
    if (integrationType.integratedPath) {
      return get(thirdPartySettings, `store.${integrationType.integratedPath}`, {})
    }
    return integrationType.integrated
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <StyledTitle>3rd Party integrations</StyledTitle>
      </div>
      <SettingsNavigation />
      <Container>
        {integrationTypes.filter(feature => !feature.hidden).map(integrationType => (
          <ThirdPartytListBox
            key={uuid()}
            label={integrationType.label}
            src={integrationType.src}
            onClick={() => {
              history.push(integrationType.route)
            }}
            disabled={integrationType.comingSoon}
            srcDisabled={integrationType.srcDisabled}
            integrated={integrated(integrationType)}
            tooltip={integrationType.tooltip}
          />
      ))}
      </Container>
    </div>
  )
}

ThirdPartyTab.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  thirdPartySettings: PropTypes.object,
}

export default compose(
  withThirdPartySettings(),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['thirdPartySettings']),
)(ThirdPartyTab)
