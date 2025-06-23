export interface ExaminationRegistrationObject {
  id?: string;
  exam_id: string;
  intern_code: string;
  index_number: string;
  result?: string;
  scores?: ExaminationScoreObject[];
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

export interface ExaminationScoreObject {
  title: string;
  score: string;
}

export interface ExaminationResultObject {
  uuid: string;
  result: string;
  scores: ExaminationScoreObject[];
  index_number: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  intern_code?: string;
  [key: string]: any //we'll have to append the score types
}

export interface ExaminationPublishResultObject {
  uuid: string;
  index_number: string;
  publish_result_date?: string;
  intern_code: string;
}
