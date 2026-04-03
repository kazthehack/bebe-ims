import { op as operation } from 'api/operation'

const getIntegrations = operation`
  query getIntegrations($storeID: ID!){
    node(id: $storeID) {
      ... on Store{
        integrations {
          metrc {
            licenseNumber,
            userKey
          }
        }
      }
    }
  }
`

export default getIntegrations
