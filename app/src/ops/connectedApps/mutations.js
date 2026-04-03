import { op as operation } from 'api/operation'

// TODO: update when there is more than one integration to update
const updateIntegrations = operation`
  mutation updateIntegrations($input: UpdateIntegrationsInput!) {
    updateIntegrations(input: $input) {
      metrc {
        userKey,
        licenseNumber,
        readOnly
      }
    }
  }
`

export default updateIntegrations
