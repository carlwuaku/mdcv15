export interface Institution {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  description?: string;
  status: string;
  ip_whitelist?: string[];
  api_key_count?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
