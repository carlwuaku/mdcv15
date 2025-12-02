import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

export interface ActionAudit {
  id: number;
  application_uuid: string | null;
  action_config: any;
  action_data: any;
  action_result: any;
  action_type: string;
  execution_time_ms: number | null;
  triggered_by: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface ActionAuditResponse {
  status: string;
  data: ActionAudit;
}

export interface StatsResponse {
  status: string;
  data: {
    total: number;
    by_type: Array<{ action_type: string; count: number }>;
    avg_execution_time_ms: number;
    daily_stats: Array<{ date: string; count: number }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ActionsAuditService {

  private baseUrl = '/admin/actions-audit';

  constructor(private http: HttpService) { }

  /**
   * Get a specific audit record by ID
   */
  getAuditRecord(id: number): Observable<ActionAuditResponse> {
    return this.http.get<ActionAuditResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get audit records for a specific application
   */
  getAuditByApplication(applicationUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/application/${applicationUuid}`);
  }

  /**
   * Get statistics about actions
   */
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/stats`);
  }

  /**
   * Delete an audit record
   */
  deleteAudit(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Cleanup old audit records
   */
  cleanup(days: number = 90): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cleanup?days=${days}`);
  }
}
