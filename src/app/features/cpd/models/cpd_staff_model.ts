import { CpdProviderObject } from './cpd_facility_model'
export interface CpdStaffObject {
  id: string;
  name: string;
  email: string;
  facility: CpdProviderObject;
  phone: string;
  username: string;
}
