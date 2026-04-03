/** NOTE: This file is pulled from the enzyme-wait repository. It has been pulled
 *        in here due to several reasons:
 *
 * - There is a bug in the currently published enzyme-wait module which prevents it
 *   from working correctly with Apollo.
 * - Pulling in the Git reference with the fix as a dependency to the project is not
 *   playing nicely with Yarn.
 *
 * URL of source: https://github.com/etiennedi/enzyme-wait/commit/7a811c2784bd648527d12ba1c168ecb6d8c11ea3
 *
 * TODO: Remove this file and use enzyme-wait once these changes have been pushed to NPM
 */

/** MIT License
 *
 * Copyright (c) 2017 etiennedi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * ITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import AssertionError from 'assertion-error'

const DISPLAY_NAME = 'waitForElement'

const createWaitForElement = (selector, maxTime = 2000, interval = 10) => (rootComponent) => {
  // Check correct usage
  if (!selector) {
    return Promise.reject(new AssertionError(`No selector specified in ${DISPLAY_NAME}.`))
  }

  if (!rootComponent) {
    return Promise.reject(new AssertionError(`No root component specified in ${DISPLAY_NAME}.`))
  }

  if (!rootComponent.length) {
    return Promise.reject(new AssertionError(`Specified root component in ${DISPLAY_NAME} not found.`))
  }

  // Race component search against maxTime
  return new Promise((resolve, reject) => {
    let remainingTime = maxTime

    const intervalId = setInterval(() => {
      if (remainingTime < 0) {
        let content = ''

        try {
          content = rootComponent.html()
        } catch (e) {
          content = rootComponent.text()
        }

        console.error(`Failed to find ${selector}. Component content: ${content}`) // eslint-disable-line no-console
        clearInterval(intervalId)

        return reject(new AssertionError(`Expected to find ${selector} within ${maxTime}ms, but it was never found. Component content: ${content}`))
      }

      const targetComponent = rootComponent.update().find(selector)
      if (targetComponent.length) {
        clearInterval(intervalId)
        return resolve(rootComponent)
      }

      remainingTime -= interval
      return undefined
    }, interval)
  })
}

export default createWaitForElement
