const GLOBAL_TIMEOUT = 30 * 1000

exports.command = function (selector) {
  return this.waitForElementVisible(selector, GLOBAL_TIMEOUT)
}
