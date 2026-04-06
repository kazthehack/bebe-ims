import React from 'react'
import ModuleOverviewPage from 'pages/modules/ModuleOverviewPage'
import { MODULE_CONFIGS } from 'pages/modules/moduleConfigs'

const CrmListPage = () => <ModuleOverviewPage {...MODULE_CONFIGS.crm} />

export default CrmListPage
