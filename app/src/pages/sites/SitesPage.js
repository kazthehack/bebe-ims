import React from 'react'
import ModuleOverviewPage from 'pages/modules/ModuleOverviewPage'
import { MODULE_CONFIGS } from 'pages/modules/moduleConfigs'

const SitesPage = () => <ModuleOverviewPage {...MODULE_CONFIGS.sites} />

export default SitesPage
