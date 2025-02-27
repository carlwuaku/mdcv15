
export interface EmailQueueObject {
  id: number;
  to_email: string;
  from_email: string;
  subject: string;
  message: string;
  cc: string;
  bcc: string;
  attachment_path: string;
  status: string;
  priority: number;
  attempts: number;
  max_attempts: number;
  error_message: string;
  headers: string;
  created_at: string;
  updated_at: string;
  scheduled_at: string;
  sent_at: string;
}
