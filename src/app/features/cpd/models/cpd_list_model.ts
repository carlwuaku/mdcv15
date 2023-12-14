import {CpdObject} from './cpd_model'
export interface CpdListObject{
  year: string;
  total_credits: string;
  cpds:CpdObject[];
}
