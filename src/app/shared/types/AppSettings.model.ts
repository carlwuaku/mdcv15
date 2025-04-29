import { IFormGenerator } from "../components/form-generator/form-generator-interface";
import { MenuItem, RenewalStageItems } from "../utils/data";


export interface AppSettings {
  appName: string,
  appVersion: string,
  appLongName: string,
  logo: string,
  recaptchaSiteKey: string,
  sidebarMenu: MenuItem[],
  dashboardMenu: MenuItem[],

  searchTypes: MenuItem[],
  licenseTypes: {
    [key: string]: {
      table: string,
      detailsPageHeaderTabs: { label: string, key: string }[],
      renewalFields: IFormGenerator[],
      renewalStages: {
        [key: string]: RenewalStageItems
      },
      renewalFilterFields: IFormGenerator[],
      advancedStatisticsFields: IFormGenerator[],
      basicStatisticsFilterFields: IFormGenerator[],
      searchFormFields: IFormGenerator[]
    },

  },
  cpdFilterFields: IFormGenerator[],
  housemanship: {
    availabilityCategories: { value: string, key: string, available?: number }[],
    sessions: {
      [key: string]: {
        number_of_facilities: number, application_form_fields: IFormGenerator[], available_to: any[], allowRepeatRegion: boolean
      }
    }
  }

}

export type HousemanshipSettings = AppSettings['housemanship'];
export type HousemanshipAvailabilityCategories = HousemanshipSettings['availabilityCategories'];
