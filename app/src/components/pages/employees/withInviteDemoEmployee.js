import { withProps } from 'recompose'

const withInviteDemoEmployee = withProps(() => ({
  sendInvite: async () => ({ data: { success: true } }),
}))

export default withInviteDemoEmployee
