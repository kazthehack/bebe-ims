import { op as operation } from 'api/operation'

const fetchHardware = operation`
  query FetchHardware($storeID: ID!) {
    store(id: $storeID) {
      id
      terminals {
        edges {
          node {
            name
            id
            hardware {
              hardwareType
              model
              ipAddress
              macAddress
            }
          }
        }
      }
    }
  }
`

export default fetchHardware
