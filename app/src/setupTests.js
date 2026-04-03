import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import mockStorage from 'mock-dom-storage'
import ReactGA from 'react-ga'

configure({ adapter: new Adapter() })
process.env = process.env || {}
process.env.REACT_APP_API_URL = 'http://bloom-portal.example.com'

const localStorageMock = mockStorage()
const sessionStorageMock = mockStorage()

ReactGA.initialize('dummy', { testMode: true })

Object.defineProperty(global, 'localStorage', { value: localStorageMock })
Object.defineProperty(global, 'sessionStorage', { value: sessionStorageMock })
Object.defineProperty(window, 'localStorage', { value: global.localStorage })
Object.defineProperty(window, 'sessionStorage', { value: global.sessionStorage })
