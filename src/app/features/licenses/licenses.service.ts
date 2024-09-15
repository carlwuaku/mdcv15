import { Injectable } from '@angular/core';

import { Observable, switchMap, throwError } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { LicenseObject } from './models/license_model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
@Injectable({
  providedIn: 'root'
})
export class LicensesService {

  constructor(private dbService: HttpService) {

  }

  getLicenseDetails(uuid: string): Observable<{ data: LicenseObject, displayColumns: string[], columnLabels: { [key: string]: string } }> {
    return this.dbService.get(`licenses/details/${uuid}`)
  }

  delete(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this license permanently? You cannot undo this action.')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{ message: string }>("licenses/details/" + uuid)
  }

  update(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("uuid", uuid);
    return this.dbService.put(`licenses/details/${uuid}`, formData)
  }




  getLicenseFormConfig(type: string): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`licenses/config/${type}`)
  }


}