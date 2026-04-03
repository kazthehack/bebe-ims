//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const createDemoUser = operation`
mutation createDemoUser($input: CreateDemoUserInput!) {
  createDemoUser(input: $input) {
    authToken {
      accessToken
      refreshToken
      expires
    }
  }
}
`

export default createDemoUser
