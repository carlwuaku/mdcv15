import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';

export interface TrainingInstitution {
  id: number;
  uuid: string;
  name: string;
  location?: string;
  contact_name?: string;
  contact_position?: string;
  region?: string;
  district?: string;
  type: string;
  phone?: string;
  email?: string;
  status?: string;
  default_limit?: number;
  registration_start_month?: number;
  registration_end_month?: number;
  category?: string;
  accredited_program?: string;
  student_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  limits?: InstitutionLimit[];
}

export interface InstitutionLimit {
  id: number;
  training_institution_uuid: string;
  student_limit: number;
  year: string;
}

export interface Student {
  id: number;
  index_number: string;
  first_name?: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  student_id: string;
  nationality?: string;
  training_institution: string;
  year?: string;
  created_by?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingInstitutionsService {

  constructor(private http: HttpService) { }

  /**
   * Get all training institutions with student count for a specific year
   */
  getTrainingInstitutions(params?: {
    limit?: number;
    page?: number;
    year?: string;
    param?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<ApiResponseObject<TrainingInstitution[]>> {
    const queryParams: string[] = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params]) {
          queryParams.push(`${key}=${params[key as keyof typeof params]}`);
        }
      });
    }
    const url = queryParams.length > 0
      ? `training-institutions?${queryParams.join('&')}`
      : 'training-institutions';
    return this.http.get<ApiResponseObject<TrainingInstitution[]>>(url);
  }

  /**
   * Get a single training institution by UUID
   */
  getTrainingInstitution(uuid: string, year?: string): Observable<{ data: TrainingInstitution, displayColumns: string[] }> {
    const url = year
      ? `training-institutions/details/${uuid}?year=${year}`
      : `training-institutions/details/${uuid}`;
    return this.http.get<{ data: TrainingInstitution, displayColumns: string[] }>(url);
  }

  /**
   * Create a new training institution
   */
  createTrainingInstitution(data: Partial<TrainingInstitution>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('training-institutions/details', data);
  }

  /**
   * Update a training institution
   */
  updateTrainingInstitution(uuid: string, data: Partial<TrainingInstitution>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`training-institutions/details/${uuid}`, data);
  }

  /**
   * Delete a training institution
   */
  deleteTrainingInstitution(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this training institution? This action cannot be undone.')) {
      throw new Error('User cancelled delete');
    }
    return this.http.delete<{ message: string }>(`training-institutions/details/${uuid}`);
  }

  /**
   * Get limits for a training institution
   */
  getInstitutionLimits(uuid: string): Observable<{ data: InstitutionLimit[] }> {
    return this.http.get<{ data: InstitutionLimit[] }>(`training-institutions/details/${uuid}/limits`);
  }

  /**
   * Set or update limit for a training institution for a specific year
   */
  setInstitutionLimit(uuid: string, year: string, studentLimit: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`training-institutions/details/${uuid}/limits`, {
      year,
      student_limit: studentLimit
    });
  }

  /**
   * Delete a limit for a training institution for a specific year
   */
  deleteInstitutionLimit(uuid: string, year: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this limit?')) {
      throw new Error('User cancelled delete');
    }
    return this.http.delete<{ message: string }>(`training-institutions/details/${uuid}/limits/${year}`);
  }

  /**
   * Get students for a training institution by year
   */
  getInstitutionStudents(uuid: string, year?: string): Observable<{ data: Student[] }> {
    const url = year
      ? `training-institutions/details/${uuid}/students?year=${year}`
      : `training-institutions/details/${uuid}/students`;
    return this.http.get<{ data: Student[] }>(url);
  }
}
