import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

export interface FailedAction {
  id: number;
  application_uuid: string | null;
  action_config: any;
  action_data: any;
  error_message: string;
  error_trace: string | null;
  status: 'failed' | 'retrying' | 'resolved';
  retry_count: number;
  last_retry_at: string | null;
  resolved_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FailedActionsResponse {
  status: string;
  data: FailedAction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FailedActionResponse {
  status: string;
  data: FailedAction;
}

export interface RetryResponse {
  status: string;
  message: string;
  data?: any;
  error_trace?: string;
}

export interface StatsResponse {
  status: string;
  data: {
    failed: number;
    retrying: number;
    resolved: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FailedActionsService {

  private baseUrl = '/admin/failed-actions';

  constructor(private http: HttpService) { }

  /**
   * Get all failed actions with pagination and filters
   */
  getAllFailedActions(page: number = 1, limit: number = 20, status?: string, search?: string): Observable<FailedActionsResponse> {
    let url = `${this.baseUrl}?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<FailedActionsResponse>(url);
  }

  /**
   * Get a specific failed action by ID
   */
  getFailedAction(id: number): Observable<FailedActionResponse> {
    return this.http.get<FailedActionResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Retry a failed action
   */
  retryAction(id: number): Observable<RetryResponse> {
    return this.http.post<RetryResponse>(`${this.baseUrl}/${id}/retry`, {});
  }

  /**
   * Delete a failed action
   */
  deleteAction(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get statistics about failed actions
   */
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/stats`);
  }

  /**
   * Cleanup old resolved actions
   */
  cleanup(days: number = 30): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cleanup?days=${days}`);
  }
}
