const TEST_USERNAME = process.env.TEST_USERNAME || 'lj@firstfoundry.co'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password'

module.exports = {
  'Can access the login page': function (browser) {
    const login = browser.page.login()

    login.navigate()
      .assert.title('Bloom Manager Portal')
      .waitForVisible('@loginCTA')
      .assert.containsText('@loginCTA', 'Log in')

    browser.end()
  },
  'Can log in with username and email': function (browser) {
    const home = browser.page.home()
    const login = browser.page.login()

    login.navigate()
      .assert.title('Bloom Manager Portal')
      .waitForVisible('@usernameField')
      .setValue('@usernameField', TEST_USERNAME)
      .waitForVisible('@passwordField')
      .setValue('@passwordField', TEST_PASSWORD)
      .waitForVisible('@loginButton')
      .click('@loginButton')

    browser.end()
  }
}
