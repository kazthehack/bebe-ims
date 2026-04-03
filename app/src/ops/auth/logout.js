//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const logoutUser = operation`
  mutation logout($input: LogoutInput!) {
    logout(input: $input) {
      ok
    }
  }
`

export default logoutUser
