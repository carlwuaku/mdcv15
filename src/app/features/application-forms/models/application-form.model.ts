export interface ApplicationFormObject {
  uuid: string,
  practitioner_type: string,
  form_type: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  application_code: string,
  form_data: { [key: string]: any },
  status: string,
  created_on: string,
  deleted_at: string,
  email: string,
  phone: string,
  qr_code: string
  actions?: any[]
}
