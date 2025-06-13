export interface ExaminationLetterObject {
  id?: string;
  exam_id?: string;
  name: string;
  type: ExaminationLetterType;
  content: string;
  created_at?: string;
  criteria?: ExaminationLetterCriteriaObject[];
}

export type ExaminationLetterType = "registration" | "pass" | "fail";

export interface ExaminationLetterCriteriaObject {
  id?: string;
  letter_id?: string;
  field: string;
  value: string[];
}
