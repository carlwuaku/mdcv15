import { IFormGenerator } from "../components/form-generator/form-generator-interface";

export interface ApiResponseObject<T> {
  data: T;
  displayColumns: string[];
  total: number;
  columnFilters: IFormGenerator[];
}
