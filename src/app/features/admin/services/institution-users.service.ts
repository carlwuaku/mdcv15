import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';

export interface InstitutionUser {
  id: number;
  uuid: string;
  username: string;
  email: string;
  email_address: string;
  display_name: string;
  phone: string;
  user_type: string;
  institution_uuid: string;
  institution_type: string;
  active: number | string;
  created_at: string;
  updated_at?: string;
}

export interface CreateInstitutionUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  institution_uuid: string;
  institution_type: 'cpd_provider' | 'housemanship_facility' | 'training_institution';
}

export interface CreateInstitutionUserResponse {
  message: string;
  data: {
    id: number;
    username: string;
    institution_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InstitutionUsersService {

  constructor(private httpService: HttpService) { }

  /**
   * Create a new institution user
   */
  createInstitutionUser(userData: CreateInstitutionUserRequest): Observable<CreateInstitutionUserResponse> {
    return this.httpService.post<CreateInstitutionUserResponse>('admin/users/institution', userData).pipe(take(1));
  }

  /**
   * Activate an institution user
   */
  activateUser(userId: number): Observable<{ message: string }> {
    return this.httpService.put<{ message: string }>(`admin/users/${userId}/activate`, {}).pipe(take(1));
  }

  /**
   * Deactivate an institution user
   */
  deactivateUser(userId: number): Observable<{ message: string }> {
    return this.httpService.put<{ message: string }>(`admin/users/${userId}/deactivate`, {}).pipe(take(1));
  }

  /**
   * Delete an institution user
   */
  deleteUser(userId: number): Observable<{ message: string }> {
    return this.httpService.delete<{ message: string }>(`admin/users/${userId}`).pipe(take(1));
  }
}
