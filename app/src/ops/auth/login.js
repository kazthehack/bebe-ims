//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const loginUser = operation`
  mutation loginUser($input: LoginInput!) {
    login(input: $input) {
      authToken {
        accessToken
        refreshToken
        expires
      }
      clientMutationId
    }
  }
`

export default loginUser
