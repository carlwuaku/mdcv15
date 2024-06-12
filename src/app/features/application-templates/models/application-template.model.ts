import { IFormGenerator } from "src/app/shared/components/form-generator/form-generator-interface"

export interface ApplicationTemplateObject {
  uuid: string,
  form_name: string,
  header: string,
  footer: string,
  guidelines: string,
  on_submit_email: string,
  on_submit_message: string,
  open_date:string,
  close_date:string,
  data: (IFormGenerator|IFormGenerator[])[],
  status: string,
  created_on: string,
  deleted_at: string,
  actions?: any[]
}
