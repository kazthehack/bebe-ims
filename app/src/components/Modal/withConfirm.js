import { withProps } from 'recompose'

const withConfirm = () => withProps(() => ({
  confirm: () => Promise.resolve(true),
}))

export default withConfirm
