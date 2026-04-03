//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import { EmployeeProfileView } from 'components/pages/employees/details/EmployeeFormViews'
import PageContent from 'components/pages/PageContent'

const UserProfilePage = () => (
  <PageContent>
    <EmployeeProfileView />
  </PageContent>
)

/* User's profile route, which will not require any employee permissions */

export default UserProfilePage
