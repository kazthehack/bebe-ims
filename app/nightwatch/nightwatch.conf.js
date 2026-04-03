const glob = require('glob')
const serverJars = glob.sync('./node_modules/selenium-server/lib/runner/selenium-server-standalone-*.jar')

if (serverJars.length === 0) {
  console.error('No selenium server JAR found. Run yarn or npm install.')
  process.exit(1)
}

const startProcess = !process.env.USE_DOCKER
const nwLaunchUrl = process.env.PORTAL_HOST_PORT
  ? 'http://' + process.env.PORTAL_HOST_PORT
  : 'http://localhost:3000'
const nwSeleniumHost = process.env.SELENIUM_HOST
  ? process.env.SELENIUM_HOST
  : 'localhost'
const chromeDriverPath = process.env.USE_DOCKER
  ? ''
  : './node_modules/.bin/chromedriver'

module.exports = {
  src_folders: ['tests'],
  output_folder: 'reports',
  custom_commands_path: './commands',
  custom_assertions_path: '',
  page_objects_path: './pages',
  globals_path: '',

  selenium: {
    start_process: startProcess,
    server_path: serverJars[0],
    log_path: '',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': chromeDriverPath
    }
  },

  test_settings: {
    default: Object.assign(
      {
        selenium_port: 4444,
        selenium_host: nwSeleniumHost,
        launch_url: nwLaunchUrl,
        silent: true,
        screenshots: {
          enabled: true,
          path: 'screenshots',
          on_failure: true,
          on_error: true
        },
        desiredCapabilities: {
          browserName: 'chrome',
          acceptSslCerts: true,
          javascriptEnabled: true,
          chromeOptions: {
            args: ['--ignore-ssl-errors', '--ignore-certificate-errors', '--no-sandbox', '--window-size=1280,1080']
          }
        }
      }
    )
  }
}
