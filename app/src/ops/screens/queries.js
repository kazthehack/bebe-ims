import { op as operation } from 'api/operation'

const getScreens = operation`
  query getScreens($storeID: ID!) {
    store(id: $storeID) {
      ... on Store {
        id
        screens {
          name
          iconName
          active
          id
          salesTypes {
            id
          }
        }
      }
    }
  }
`

export default getScreens
