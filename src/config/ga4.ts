import ga4 from 'react-ga4'
import { UaEventOptions } from 'react-ga4/types/ga4'

// GA4 id has this format: G-XXXXXXXXXX
const ga4Id = process.env.REACT_APP_GOOGLE_ANALYTICS
const isProduction = process.env.NODE_ENV === 'production'

export const init = () => {
  if (isProduction && ga4Id) ga4.initialize(ga4Id)
}

export const sendEvent = (
  optionsOrName: UaEventOptions | string,
  params?: any
) => ga4.event(optionsOrName, params)
export const sendPageview = (path: string) =>
  ga4.send({
    hitType: 'pageview',
    page: path,
  })
