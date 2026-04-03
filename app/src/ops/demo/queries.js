import { op as operation } from 'api/operation'

const fetchDemoStoreStatus = operation`
  query fetchDemoStoreStatus {
    demoStoreStatus
  }
`

export default fetchDemoStoreStatus
