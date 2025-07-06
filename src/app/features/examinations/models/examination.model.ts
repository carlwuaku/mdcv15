import { ExaminationLetterObject } from "./examination-letter.model";

export interface ExaminationObject {
  uuid: string;
  id: string;
  title: string;
  exam_type: string;
  open_from: string;
  open_to: string;
  type: string;
  publish_scores: "yes" | "no";
  publish_score_date: string;
  next_exam_month: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>[];
  letters?: ExaminationLetterObject[];
  scores_names: string[]
}
