import { op as operation } from 'api/operation'

const getSalesTypes = operation`
  query getSalesTypes($storeID: ID!) {
    store(id: $storeID) {
      id
      salesTypes {
        state
        name
        category
        unit
        iconName
        id
        portalTag
        liquid
      }
    }
  }
`

export default getSalesTypes
