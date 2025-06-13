export interface ExaminationRegistrationObject {
  id?: string;
  exam_id: string;
  intern_code: string;
  index_number: string;
  result?: string;
  scores?: any[];
  uuid?: string;
  registration_letter?: string;
  result_letter?: string;
  publish_result_date?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email: string;
  phone_number: string;
}
