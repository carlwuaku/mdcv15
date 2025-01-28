import { IFormGenerator } from "../components/form-generator/form-generator-interface";

export interface FormGeneratorComponentInterface {
  formUrl: string;
  existingUrl: string;
  fields: (IFormGenerator | IFormGenerator[])[];
  extraFormData?: { key: string, value: any }[];
  formSubmitted(args: boolean): void;
}
