import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import {
  ApplicationTimelineResponse,
  ApplicationStatusHistoryResponse,
  TimelineQueryParams
} from '../models/application-timeline.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationTimelineService {

  constructor(private httpService: HttpService) { }

  /**
   * Get complete timeline for an application
   * @param applicationUuid Application UUID
   * @param params Optional query parameters (limit, offset, orderDir)
   * @returns Observable of timeline response
   */
  getTimeline(applicationUuid: string, params?: TimelineQueryParams): Observable<ApplicationTimelineResponse> {
    let url = `applications/details/${applicationUuid}/timeline`;

    // Build query string
    const queryParams: string[] = [];
    if (params) {
      if (params.limit !== undefined) {
        queryParams.push(`limit=${params.limit}`);
      }
      if (params.offset !== undefined) {
        queryParams.push(`offset=${params.offset}`);
      }
      if (params.orderDir) {
        queryParams.push(`orderDir=${params.orderDir}`);
      }
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return this.httpService.get<ApplicationTimelineResponse>(url);
  }

  /**
   * Get simplified status history for an application
   * @param applicationUuid Application UUID
   * @returns Observable of status history response
   */
  getStatusHistory(applicationUuid: string): Observable<ApplicationStatusHistoryResponse> {
    return this.httpService.get<ApplicationStatusHistoryResponse>(
      `applications/details/${applicationUuid}/status-history`
    );
  }

  /**
   * Get timeline from portal endpoints (for practitioners)
   * @param applicationUuid Application UUID
   * @param params Optional query parameters
   * @returns Observable of timeline response
   */
  getPortalTimeline(applicationUuid: string, params?: TimelineQueryParams): Observable<ApplicationTimelineResponse> {
    let url = `portal/applications/details/${applicationUuid}/timeline`;

    const queryParams: string[] = [];
    if (params) {
      if (params.limit !== undefined) {
        queryParams.push(`limit=${params.limit}`);
      }
      if (params.offset !== undefined) {
        queryParams.push(`offset=${params.offset}`);
      }
      if (params.orderDir) {
        queryParams.push(`orderDir=${params.orderDir}`);
      }
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return this.httpService.get<ApplicationTimelineResponse>(url);
  }

  /**
   * Get portal status history (for practitioners)
   * @param applicationUuid Application UUID
   * @returns Observable of status history response
   */
  getPortalStatusHistory(applicationUuid: string): Observable<ApplicationStatusHistoryResponse> {
    return this.httpService.get<ApplicationStatusHistoryResponse>(
      `portal/applications/details/${applicationUuid}/status-history`
    );
  }
}
