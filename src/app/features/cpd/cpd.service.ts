import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { CpdObject } from './models/cpd_model';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { CpdProviderObject } from './models/cpd_facility_model';

@Injectable({
  providedIn: 'root'
})
export class CpdService {

  constructor(private dbService: HttpService) { }

  getCPDList(): Observable<ApiResponseObject<CpdObject[]>> {
    return this.dbService.get('cpd/details')
  }

  deleteCpdProvider(object: CpdProviderObject): Observable<{ message: string }> {

    return this.dbService.delete<{ message: string }>("cpd/providers/" + object.id).pipe(take(1));
  }

  getCpdDetails(id: string): Observable<{ data: CpdObject, displayColumns: string[] }> {
    return this.dbService.get('cpd/details/' + id)
  }

  deleteCpd(object: CpdObject): Observable<{ message: string }> {

    return this.dbService.delete<{ message: string }>("cpd/details/" + object.uuid).pipe(take(1));
  }
}
