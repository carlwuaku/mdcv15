import {CpdObject} from "./cpd_model"
export interface CpdAttendanceObject{
  attendance_date: string;
  id: string;
  person:any ;
  cpd:CpdObject;
  venue:string ;
  selected:any;
  lic_num:any;
  first_name:string;
  middle_name:string;
  last_name: string;
  email: string;
  type: string;
}
