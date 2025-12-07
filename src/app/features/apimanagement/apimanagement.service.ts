import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { Institution } from './models/institution.model';
import { ApiKey, ApiKeyStats } from './models/api-key.model';

@Injectable({
  providedIn: 'root'
})
export class ApiManagementService {

  constructor(private dbService: HttpService) {}

  // Institution endpoints
  getInstitutions(): Observable<ApiResponseObject<Institution[]>> {
    return this.dbService.get('api-integration/institutions');
  }

  getInstitution(id: string): Observable<{ data: Institution, displayColumns: string[] }> {
    return this.dbService.get(`api-integration/institutions/${id}`);
  }

  getInstitutionFormFields(): Observable<any> {
    return this.dbService.get('api-integration/institutions/form-fields');
  }

  getInstitutionsList(): Observable<{ data: Institution[] }> {
    return this.dbService.get('api-integration/institutions/list');
  }

  deleteInstitution(object: Institution): Observable<{ message: string }> {
    return this.dbService.delete(`api-integration/institutions/${object.id}`);
  }

  // API Key endpoints
  getApiKeys(): Observable<ApiResponseObject<ApiKey[]>> {
    return this.dbService.get('api-integration/api-keys');
  }

  getApiKey(id: string): Observable<ApiKey> {
    return this.dbService.get(`api-integration/api-keys/${id}`);
  }

  getApiKeyFormFields(): Observable<any> {
    return this.dbService.get('api-integration/api-keys/form-fields');
  }

  getApiKeyStats(id: string, startDate?: string, endDate?: string): Observable<ApiKeyStats> {
    let url = `api-integration/api-keys/${id}/stats`;
    const params = [];
    if (startDate) params.push(`start_date=${startDate}`);
    if (endDate) params.push(`end_date=${endDate}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.dbService.get(url);
  }

  getApiKeyLogs(id: string, limit?: number): Observable<{ data: any[], total: number }> {
    let url = `api-integration/api-keys/${id}/logs`;
    if (limit) url += `?limit=${limit}`;
    return this.dbService.get(url);
  }

  getApiKeyDocumentation(id: string): Observable<any> {
    return this.dbService.get(`api-integration/api-keys/${id}/documentation`);
  }

  revokeApiKey(id: string, reason?: string): Observable<{ message: string }> {
    return this.dbService.post(`api-integration/api-keys/${id}/revoke`, { reason });
  }

  rotateApiKey(id: string): Observable<{ message: string, data: ApiKey, warning: string }> {
    return this.dbService.post(`api-integration/api-keys/${id}/rotate`, {});
  }

  updateApiKeyPermissions(id: string, permissions: string[]): Observable<{ message: string }> {
    return this.dbService.put(`api-integration/api-keys/${id}/permissions`, { permissions });
  }

  getAvailablePermissions(): Observable<any[]> {
    return this.dbService.get('api-integration/api-keys/permissions');
  }

  deleteApiKey(object: ApiKey): Observable<{ message: string }> {
    return this.dbService.delete(`api-integration/api-keys/${object.id}`);
  }
}
