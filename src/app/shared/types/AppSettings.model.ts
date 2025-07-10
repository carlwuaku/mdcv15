import { ExaminationLetterType } from "src/app/features/examinations/models/examination-letter.model";
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
  renewalBasicStatisticsFilterFields: IFormGenerator[],
  basicStatisticsFilterFields: IFormGenerator[],
  advancedStatisticsFilterFields: IFormGenerator[],
  searchTypes: MenuItem[],
  licenseTypes: {
    [key: string]: {
      table: string,
      detailsPageHeaderTabs: { label: string, key: string }[],
      renewalFields: IFormGenerator[],
      renewalStages: {
        [key: string]: RenewalStageItems
      },
      basicStatisticsFields: BasicStatisticField[],
      renewalFilterFields: IFormGenerator[],
      advancedStatisticsFields: IFormGenerator[],
      basicStatisticsFilterFields: IFormGenerator[],
      searchFormFields: IFormGenerator[],
      renewalBasicStatisticsFilterFields: IFormGenerator[],
      renewalBasicStatisticsFields: BasicStatisticField[]
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
  },
  examinations: {
    filterFields: IFormGenerator[],
    defaultLetterTypes: { type: ExaminationLetterType, name: string, criteria: { field: string, value: string[] }[] }[]
  }

}

export type HousemanshipSettings = AppSettings['housemanship'];
export type HousemanshipAvailabilityCategories = HousemanshipSettings['availabilityCategories'];
export type BasicStatisticField = {
  label: string,
  name: string,
  type: string,
  xAxisLabel: string,
  yAxisLabel: string
};
