export interface LicenseObject {

  id: string;
  type: string;
  name: string;
  license_number: string;
  registration_date: string;
  status: string;
  postal_address: string;
  picture: string;
  region: string;
  district: string;
  portal_access: string;
  last_renewal_start: string;
  last_renewal_expiry: string;
  last_renewal_status: string;
  modified_on: string;
  created_on: string;
  email: string;
  phone: any;
  in_good_standing: string;
  selected: boolean;
  uuid: string;
  deleted_at: string | null;
  last_renewal_uuid: string | null;
  [key: string]: any;
}


