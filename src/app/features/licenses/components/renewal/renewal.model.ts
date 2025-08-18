export interface RenewalObject {
  id: string;
  license_uuid: string;
  deleted_at: string | null;
  uuid: string;
  license_number: string;
  deleted_by: string;
  deleted: string;
  modified_by: string;
  created_by: string;
  created_on: string;
  modified_on: string;
  receipt: string;
  qr_code: string;
  qr_text: string;
  expiry: string;

  status: string;
  payment_date: string;
  payment_file: string;
  payment_file_date: string;

  picture: string;

  license_type: string;
  print_template: string;
  online_print_template: string;
  in_print_queue: boolean;
  name: string;
  phone: string;
  email: string;
  region: string;
  district: string;
  country_of_practice: string;
}
