import {CpdObject} from './cpd_model';
export interface CpdSessionObject{
  id: string;
  cpd?: CpdObject | null;
  venue:string;
  date:string;
  start_time:string;
  end_time:string;
  region:string
}

export const newCpdSessionObject: CpdSessionObject = {
  id: "",
  date: "",
  cpd: null,
  end_time: "",
  region: "",
  start_time: "",
  venue: ""
};
