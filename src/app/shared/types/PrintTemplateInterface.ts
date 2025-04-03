

export interface PrintTemplate {
  id: string;
  uuid: string;
  template_name: string;
  template_content: string;
  created_at: string;
  updated_at: string;
  active: "1" | "0"; // "1" for active, "0" for inactive
  allowed_roles: string[]; // Array of roles allowed to use this template
}
