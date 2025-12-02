import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';

export interface Guest {
  uuid: string;
  unique_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_type: string;
  id_number: string;
  id_image?: string;
  postal_address?: string;
  sex: string;
  picture?: string;
  date_of_birth?: string;
  country?: string;
  email_verified: boolean;
  email_verified_at?: string;
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface GuestsListResponse {
  data: Guest[];
  total: number;
  displayColumns: string[];
  columnFilters: any[];
}

@Injectable({
  providedIn: 'root'
})
export class GuestsService {

  constructor(private httpService: HttpService) { }

  /**
   * Get list of registered guests with filters
   */
  getGuests(params?: { [key: string]: any }): Observable<GuestsListResponse> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.httpService.get<GuestsListResponse>(`admin/guests${queryParams}`).pipe(take(1));
  }

  /**
   * Verify guests (bulk operation)
   */
  verifyGuests(guestUuids: string[]): Observable<{ message: string; count: number }> {
    return this.httpService.post<{ message: string; count: number }>('admin/guests/verify', { guest_uuids: guestUuids }).pipe(take(1));
  }

  /**
   * Unverify guests (bulk operation)
   */
  unverifyGuests(guestUuids: string[]): Observable<{ message: string; count: number }> {
    return this.httpService.post<{ message: string; count: number }>('admin/guests/unverify', { guest_uuids: guestUuids }).pipe(take(1));
  }

  /**
   * Delete a guest
   */
  deleteGuest(uuid: string): Observable<{ message: string }> {
    return this.httpService.delete<{ message: string }>(`admin/guests/${uuid}`).pipe(take(1));
  }
}
