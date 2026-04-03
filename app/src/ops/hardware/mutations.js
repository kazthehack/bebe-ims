//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const deleteTerminal = operation`
  mutation deleteTerminal($input: DeleteTerminalInput!) {
    deleteTerminal(input: $input) {
        terminal {
          id
        }
    }
  }
`
export default deleteTerminal
