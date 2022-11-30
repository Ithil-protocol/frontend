import ga4 from 'react-ga4'
import { UaEventOptions } from 'react-ga4/types/ga4'

const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS
const isProduction = process.env.NODE_ENV === 'production'

export const init = () => {
  if (TRACKING_ID == null) return

  ga4.initialize(TRACKING_ID, {
    testMode: !isProduction
  })
}

export const sendEvent = (optionsOrName: UaEventOptions | string, params?: any) => ga4.event(optionsOrName, params)
export const sendPageview = (path: string) => ga4.send({
  hitType: 'pageview',
  page: path
})
