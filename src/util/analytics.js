import ReactGA from "react-ga"

export const initGA = () => {
  ReactGA.initialize("UA-169614843-1")
}
 
export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = "", action = "") => {
  console.log(`logging ${category} and ${action}`)
  if (category && action) {
    ReactGA.event({ category, action })
  }
}
export const logException = (description = "", action = "", fatal = false) => {
  console.log(`logging exception ${description}, ${action}`)
  if (description) {
    ReactGA.exception({ description, action, fatal })
  }
}