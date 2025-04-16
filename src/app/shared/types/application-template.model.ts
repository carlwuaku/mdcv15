import { IFormGenerator } from "src/app/shared/components/form-generator/form-generator-interface"

export interface ApplicationTemplateObject {
  uuid: string,
  form_name: string,
  picture: string,
  available_externally: string,
  header: string,
  footer: string,
  guidelines: string,
  on_submit_email: string,
  on_submit_message: string,
  open_date: string,
  close_date: string,
  data: (IFormGenerator | IFormGenerator[])[],
  status: string,
  created_on: string,
  deleted_at: string,
  actions?: any[],
  approve_url: string,
  deny_url: string,
  initialStage: string,
  stages: string,
  finalStage: string,
}


export interface ApplicationTemplateStageObject {
  name: string,
  description: string,
  allowedTransitions: string[],
  allowedUserRoles: string[],
  actions: { type: string, config: { template: string, subject: string, endpoint: string, method: string, recipient_field: string } }[]
}
