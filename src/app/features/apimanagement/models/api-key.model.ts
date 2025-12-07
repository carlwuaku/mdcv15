export interface ApiKey {
  id: string;
  institution_id: string;
  institution_name?: string;
  name: string;
  key_id: string;
  key_secret?: string; // Only returned on creation/rotation
  key_secret_hash?: string; // Never returned to client
  hmac_secret?: string; // Never returned to client
  hmac_secret_plaintext?: string; // Only returned on creation
  last_4_secret: string;
  status: string;
  expires_at?: string;
  last_used_at?: string;
  last_used_ip?: string;
  rate_limit_per_minute?: number;
  rate_limit_per_day?: number;
  scopes?: any[];
  allowed_endpoints?: string[];
  metadata?: any;
  revoked_at?: string;
  revoked_by?: string;
  revocation_reason?: string;
  permissions?: string[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ApiKeyStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  last_request_at?: string;
  requests_by_endpoint?: { endpoint: string; count: number }[];
  requests_by_date?: { date: string; count: number }[];
}

export interface ApiKeyDocumentation {
  endpoints: ApiEndpoint[];
  authentication: string;
  rate_limits?: string;
  examples?: any;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: any[];
  response?: any;
}
