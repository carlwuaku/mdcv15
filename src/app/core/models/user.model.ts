export class User {
    id: string;
    display_name: string;
    email: string;
    permissions: string[];
    token: string;
    type: string;
    region: string;
    role: string;
    position: string;
    username: string;
    picture: string;
    active: string;
    phone: string;
    deleted_at: string |null;
    status: string;

    constructor(data?:IUser) {
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
    }
}

export interface IUser{
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
}
