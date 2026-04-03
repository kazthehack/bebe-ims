module.exports = {
  url() {
    return `${this.api.launchUrl}/login`
  },
  elements: {
    loginCTA: 'h3',
    usernameField: '#email-input',
    passwordField: '#password-input',
    loginButton: '.loginButtonContainer button',
  },
}
