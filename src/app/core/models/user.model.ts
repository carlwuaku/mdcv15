export class User {
  id: string;
  uuid: string;
  display_name: string;
  email: string;
  permissions: string[];
  token: string;
  type: string;
  region: string;
  role: string;
  role_name: string;
  position: string;
  username: string;
  picture: string;
  active: string;
  phone: string;
  deleted_at: string | null;
  status: string;
  google_authenticator_setup: string;

  constructor(data?: IUser) {
    this.id = data?.id || "";
    this.username = data?.username || "";
    this.display_name = data?.display_name || "";
    this.email = data?.email || "";
    this.permissions = data?.permissions || [];
    this.token = data?.token || "";
    this.type = data?.type || "";
    this.region = data?.region || "";
    this.role = data?.role || "";
    this.position = data?.position || "";
    this.picture = data?.picture || "";
    this.active = data?.active || "";
    this.phone = data?.phone || "";
    this.deleted_at = "";
    this.status = "";
    this.role_name = "";
    this.google_authenticator_setup = "no";
    this.uuid = data?.uuid || "";
  }
}

export interface IUser {
  id: string;
  display_name: string;
  email: string;
  token: string;
  type: string;
  region: string;
  role: string;
  position: string;
  username: string;
  picture: string;
  active: string;
  phone: string;
  permissions: string[];
  google_authenticator_setup: string;
  uuid: string;
}
