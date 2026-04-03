//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const refreshToken = operation`
  mutation refreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      authToken {
        accessToken
        refreshToken
        expires
      }
      clientMutationId
    }
  }
`

export default refreshToken
