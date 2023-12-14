import {CpdFacilityObject} from './cpd_facility_model'
export interface CpdStaffObject{
  id: string;
  name: string;
  email: string;
  facility:CpdFacilityObject;
  phone:string;
  username:string;
}
