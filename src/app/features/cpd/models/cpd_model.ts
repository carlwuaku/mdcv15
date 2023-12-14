import {CpdFacilityObject} from './cpd_facility_model';

export interface CpdObject{
  topic:string;
  credits:string;
  attendance_date?:string;
  facility?: CpdFacilityObject;
  venue?:string;
  id?:string;
  date:string;
  end_date:string;
  group:string;
  number_of_attendants?:number;
  number_of_sessions?: number;
  category:string;
  online:string;
  url:string;
  start_month:string;
  end_month:string;
  start_month_name?:string;
  end_month_name?:string;
  facility_id: string;
  facility_name?:string;
  phone?:string;
  email?:string;
}
