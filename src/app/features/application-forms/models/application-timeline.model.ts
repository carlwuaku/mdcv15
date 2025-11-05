export interface ApplicationTimelineEntry {
  id: number;
  uuid: string;
  application_uuid: string;
  user_id: number;
  username?: string;
  user_email?: string;
  from_status: string | null;
  to_status: string;
  stage_data: ApplicationStageData | null;
  actions_executed: ApplicationActionExecuted[] | null;
  actions_results: ApplicationActionsResults | null;
  submitted_data: { key: string, value: any }[] | null;
  notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApplicationStageData {
  name: string;
  description?: string;
  allowedTransitions?: string[];
  allowedUserRoles?: string[];
  actions?: any[];
}

export interface ApplicationActionExecuted {
  type: string;
  config?: any;
}

export interface ApplicationActionsResults {
  success: boolean;
  error?: string;
  message?: string;
  actions?: ApplicationActionResult[];
}

export interface ApplicationActionResult {
  action_type: string;
  action_config?: any;
  success: boolean;
  result?: any;
  error?: string;
  timestamp: string;
}

export interface ApplicationSubmittedData {
  notes?: string;
  comments?: string;
  attachments?: any[];
  reviewer_comments?: string;
  [key: string]: any;
}

export interface ApplicationStatusHistory {
  to_status: string;
  created_at: string;
  username?: string;
}

export interface ApplicationTimelineResponse {
  success: boolean;
  data: ApplicationTimelineEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApplicationStatusHistoryResponse {
  success: boolean;
  data: ApplicationStatusHistory[];
}

export interface TimelineQueryParams {
  limit?: number;
  offset?: number;
  orderDir?: 'ASC' | 'DESC';
}
