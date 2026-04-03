import { op as operation } from 'api/operation'

export const sendResetPasswordEmail = operation`
  mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
    sendResetPasswordEmail(input: $input) {
      clientMutationId # By requesting this instead of ok, we don't leak the existance of the email
    }
  }
`

export const resetPassword = operation`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      clientMutationId
    }
  }
`

export const verifyPasswordEmailToken = operation`
  mutation verifyPasswordEmailToken($input: VerifyPasswordEmailTokenInput!) {
    verifyPasswordEmailToken(input: $input) {
      clientMutationId
      ok
    }
  }
`
