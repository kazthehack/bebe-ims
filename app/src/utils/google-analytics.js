import ReactGA from 'react-ga'
import * as GATypes from 'constants/GoogleAnalyticsTypes'

export const initializeGA = () => {
  ReactGA.initialize('UA-163711455-4')
}

export const trackPageView = (location) => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}

export const trackWebVitals = ({ name, id, value }) => {
  ReactGA.event({
    category: GATypes.eventCategories.webVitals,
    action: name,
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate
  })
}
