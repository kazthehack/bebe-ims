import { op as operation } from 'api/operation'

const updateScreen = operation`
mutation updateScreen($input: UpdateScreenInput!) {
  updateScreen(input: $input) {
    screen {
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
`

export default updateScreen
