export interface SettingsObject {
  class:string;
  context:string;
  key:string;
  value:string|any[]|{[key:string]:any};
  created_at:string;
  deleted_at: string;
  type: string;
  control_type:string;
}
