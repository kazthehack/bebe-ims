import { withProps } from 'recompose'

const withChangePassword = withProps(() => ({
  changePassword: async () => ({ data: { success: true } }),
}))

export default withChangePassword
