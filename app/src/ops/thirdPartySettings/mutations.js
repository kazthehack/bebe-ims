import { op as operation } from 'api/operation'

export const updateIntegrations = operation`
  mutation UpdateIntegrations($input: UpdateIntegrationsInput!) {
    updateIntegrations(input: $input) {
      success
    }
  }
`

export const updateLeafly = operation`
  mutation UpdateLeafly($input: UpdateLeaflyInput!) {
    updateLeafly(input: $input) {
      success
    }
  }
`

export const updateBloomMenu = operation`
  mutation UpdateBloomMenu($input: UpdateBloomMenuInput!) {
    updateBloomMenu(input: $input) {
      success
    }
  }
`

export const updatePaybotics = operation`
  mutation UpdatePaybotics($input: UpdatePayboticsInput!) {
    updatePaybotics(input: $input) {
      success
    }
  }
`
