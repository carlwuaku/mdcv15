import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

export interface AppSettingOverride {
  id?: number;
  setting_key: string;
  setting_value: string;
  value_type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  merge_strategy?: 'replace' | 'merge' | 'append' | 'prepend';
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface AppSettingsResponse {
  status: string;
  data: {
    fileSettings: { [key: string]: any };
    overrides: AppSettingOverride[];
  };
}

export interface AppSettingDetailResponse {
  status: string;
  data: {
    key: string;
    effectiveValue: any;
    fileValue: any;
    override: AppSettingOverride | null;
  };
}

export interface AvailableKey {
  key: string;
  type: string;
  hasChildren: boolean;
}

export interface AvailableKeysResponse {
  status: string;
  data: AvailableKey[];
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private baseUrl = '/admin/app-settings';

  constructor(private http: HttpService) { }

  /**
   * Get all app settings (file settings + overrides)
   */
  getAllSettings(): Observable<AppSettingsResponse> {
    return this.http.get<AppSettingsResponse>(this.baseUrl);
  }

  /**
   * Get a specific setting by key
   */
  getSetting(key: string): Observable<AppSettingDetailResponse> {
    return this.http.get<AppSettingDetailResponse>(`${this.baseUrl}/${key}`);
  }

  /**
   * Get all available keys from app-settings.json
   */
  getAvailableKeys(): Observable<AvailableKeysResponse> {
    return this.http.get<AvailableKeysResponse>(`${this.baseUrl}/keys`);
  }

  /**
   * Create or update a setting override
   */
  createOverride(data: Partial<AppSettingOverride>): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  /**
   * Update an existing override
   */
  updateOverride(id: number, data: Partial<AppSettingOverride>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete/deactivate an override
   */
  deleteOverride(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Clear settings cache
   */
  clearCache(): Observable<any> {
    return this.http.post(`${this.baseUrl}/clear-cache`, {});
  }
}
