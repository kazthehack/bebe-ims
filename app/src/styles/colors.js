
const colors = {
  black: '#000000',
  blackLight: '#1c1c1c',
  blue: '#1875f0', // NavigationBar top of active tab
  blueLight: '#8bbaf7', // Disabled state blue
  blueDark: '#1f2f45', // Side bar
  gray: '#808080',
  grayDark: '#c7c7c7', // Disabled state Gray, Search Fields // NavigationBar
  grayDark2: '#5e5e5e', // Label text (Will become modal text color and textbox text color)
  grayDark3: '#4d4d4d', // Header text
  grayLight: '#a6a6a6', // Disabled inputs, Notifications, Stroke, Price Group Inactive Column, Disabled pagination arrow
  grayLight2: '#e7e7e7', // Cancel button, Fill bar, Stroke
  grayLight3: '#f8f8f8', // Toggle (We could convert these to white, but this color was an orginal Jamison color)
  grayLight4: '#fbfbfb', // Used for textfield disabled background
  grayLight5: '#d2d2d2', // Used for placeholder text
  grayLight6: '#afafaf', // Used for the new dashboard page
  blueishGray: '#8b939e',
  whisper: '#eaeaea',
  green: '#18f086',
  red: '#ff6666',
  white: '#ffffff',
  yellow: '#ffb000', // Used for notification
  trans: {
    black05: 'rgba(0, 0, 0, 0.05)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black15: 'rgba(0, 0, 0, 0.15)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    blue30: 'rgba(24, 117, 240, 0.3)',
    blue70: 'rgba(24, 117, 240, 0.7)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white95: 'rgba(255, 255, 255, 0.95)',
    gray72: 'rgba(28, 28, 28, 0.72)',
    grayDark22: 'rgba(76, 76, 76, 0.22)',
    grayDark2_50: 'rgba(94, 94, 94, 0.5)',
    gray95: 'rgba(242, 242, 242, 0.95)',
  },
  graphColors: {
    blue: '#217af1',
    teal: '#21f1d6',
    green: '#21f177',
    yellow: '#f1d621',
    lightOrange: '#f1a921',
    orange: '#f16a21',
    red: '#d0021b',
    magenta: '#f12196',
    violet: '#a021f1',
    purple: '#4d21f1',
  },
  dashboardGraphs: {
    lightBlue: '#76ddfb',
    blue: '#1875f0',
    darkBlue: '#0b4796',
  },
  success: '#2196f3',
  warning: '#ffc107',
}

export const TABLE_COLORS = Object.values(colors.graphColors)

export default colors
