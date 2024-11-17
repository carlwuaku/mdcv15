import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { RenewalObject } from './components/renewal/renewal.model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Observable, throwError } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Injectable({
  providedIn: 'root'
})
export class RenewalService {

  constructor(private dbService: HttpService, private notify: NotifyService) {

  }



  delete(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this renewal record permanently? You will have to create a new one')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{ message: string }>("licenses/renewal/" + uuid)
  }

  update(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("uuid", uuid);
    return this.dbService.put(`licenses/renewal/${uuid}`, formData)

  }

  getRenewalFormFields(type: string): Observable<{ data: IFormGenerator[] }> {
    console.log(type)
    return this.dbService.get(`licenses/renewal-form-fields/${type}`)
  }

  updateBulkForStage(data: Record<string, any>[], stage: string): Observable<{ message: string, data: { message: string, successful: boolean, id: string }[] }> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data))
    formData.append("status", stage);
    return this.dbService.put(`licenses/renewalStage`, formData)

  }
}
