import { withProps } from 'recompose'

const withStoreRoles = () => withProps(() => ({
  portalRoles: [],
  posRoles: [],
}))

export default withStoreRoles
