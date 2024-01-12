import { Permissions } from "./permissions.model";

export class Role{
  role_id: string ='';
  role_name: string = '';
  description: string = '';
  permissions: Permissions[] = [];
  deleted_at: string | null = null;
}
