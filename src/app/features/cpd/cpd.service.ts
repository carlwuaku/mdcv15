import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { CpdObject } from './models/cpd_model';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { CpdProviderObject } from './models/cpd_facility_model';
import { CpdAttendanceObject } from './models/cpd_attendance_model';

@Injectable({
  providedIn: 'root'
})
export class CpdService {

  constructor(private dbService: HttpService) { }

  getCPDList(): Observable<ApiResponseObject<CpdObject[]>> {
    return this.dbService.get('cpd/details')
  }

  deleteCpdProvider(object: CpdProviderObject): Observable<{ message: string }> {

    return this.dbService.delete<{ message: string }>("cpd/providers/" + object.uuid).pipe(take(1));
  }

  getCpdDetails(id: string): Observable<{ data: CpdObject, displayColumns: string[] }> {
    return this.dbService.get<{ data: CpdObject, displayColumns: string[] }>('cpd/details/' + id).pipe(take(1))
  }

  deleteCpd(object: CpdObject): Observable<{ message: string }> {

    return this.dbService.delete<{ message: string }>("cpd/details/" + object.uuid).pipe(take(1));
  }

  deleteCpdAttendance(object: CpdAttendanceObject): Observable<{ message: string }> {

    return this.dbService.delete<{ message: string }>("cpd/attendance/" + object.uuid).pipe(take(1));
  }

  submitCpdAttendance(data: { cpd_uuid: string, license_number: string[], attendance_date: string, venue: string }): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>("cpd/attendance", data).pipe(take(1));
  }

  getCpdProviderDetails(id: string): Observable<{ data: CpdProviderObject, displayColumns: string[] }> {
    return this.dbService.get<{ data: CpdProviderObject, displayColumns: string[] }>('cpd/providers/' + id).pipe(take(1))
  }

  getLicenseCpdHistory(licenseNumber: string, year: string): Observable<ApiResponseObject<CpdAttendanceObject[]>> {
    return this.dbService.get<ApiResponseObject<CpdAttendanceObject[]>>(`cpd/license-attendance?license_number=${licenseNumber}&year=${year}`).pipe(take(1));
  }
}
