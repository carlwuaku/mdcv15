export interface IFormGenerator {
  label: string;
  name: string;
  type: string;
  hint: string;
  options: { key: string, value: string }[];
  className?: string;
  subtitle?: string;
  value: any;
  required: boolean;
  api_url?: string;
  apiLabelProperty?: string;
  apiKeyProperty?: string;
  apiType?: "search" | "select" | "datalist";
  apiInitialValue?: string;
  apiModule?: string;
  onChange?: (...value:string[]) => void | undefined;
  minLength?: number;
  maxLength?: number;
  customValidation?: {fieldsMatch: string[]};

}

export const defaultObject: IFormGenerator = {
  label: "",
  name: "",
  type: "",
  hint: "",
  options: [],
  value: "",
  required: true
}

export const monthsOptions = [
  { key: "January", value: "1" },
  { key: "February", value: "2" },
  { key: "March", value: "3" },
  { key: "April", value: "4" },
  { key: "May", value: "5" },
  { key: "June", value: "6" },
  { key: "July", value: "7" },
  { key: "August", value: "8" },
  { key: "September", value: "9" },
  { key: "October", value: "10" },
  { key: "November", value: "11" },
  { key: "December", value: "12" }
]

export const PractitionerCategories = [
  { key: "Medical", value: "Medical" },
  { key: "Dental", value: "Dental" },
  { key: "Physician Assistant", value: "Physician Assistant" },
]
