import { op as operation } from 'api/operation'

export const getThirdPartySettings = operation`
  query GetThirdPartySettings {
    viewer {
      id
    }
  }
`

export const getMetrcSettings = operation`
  query GetMetrcSettings {
    viewer {
      id
    }
  }
`

export const getLeaflySettings = operation`
  query GetLeaflySettings {
    viewer {
      id
    }
  }
`

export const getBloomMenuSettings = operation`
  query GetBloomMenuSettings {
    viewer {
      id
    }
  }
`
