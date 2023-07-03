export const environment = {
  production: true,
  name: "prod",
  productName: "Hire Tracker",
  debug: {
    routeTracing: false,
    enableAzureB2CAuthLogs: false // set to 'true' to output all auth related console.logs produced by MSAL Auth Library (Azure B2C)
  },
  defaultLanguage: "en",
  //isIE11: (<any>window)["loxam"].isIE11,
  //isSafariBrowser: (<any>window)["loxam"].isSafari, // only reliable way of testing if it is Safari. we are doing an inverse test and catching anything that is not Chrome or on Android
  pageSize: 20,
  googleMapsApiKey: "AIzaSyDXXMpGz4SWnvPpGo4O7re4m0lVsGPSYMw",
  appInsightsKey: "",
  appSettings: {
    googleAnalyticsTrackingId: "0",
    featureToggles:{},

    config: {
      production: false,
      useSessionStorage: false
    },
    api: {
      host: "https://lox-tracking-app-api-qa.azurewebsites.net/",
      namespace: "api/v2/"
    }
  }
};
