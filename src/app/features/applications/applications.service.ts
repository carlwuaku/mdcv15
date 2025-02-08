import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Observable, throwError } from 'rxjs';
import { ApplicationTemplateObject } from '../../shared/types/application-template.model';
@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  url = "applications/templates";
  constructor(private dbService: HttpService, private notify: NotifyService) {

  }
  delete(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this template permanently? It will not affect any existing applications, but you will have to create a new one if you need it again.')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{ message: string }>(`${this.url}/${uuid}`)
  }

  update(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("uuid", uuid);
    return this.dbService.put(`${this.url}/${uuid}`, formData)

  }

  getTemplate(uuid: string): Observable<{ data: ApplicationTemplateObject }> {
    this.notify.showLoading();
    return this.dbService.get<any>(`${this.url}/${uuid}`)
  }

  getApplicationFormTypes(): Observable<{ data: ApplicationTemplateObject[] }> {
    return this.dbService.get(`applications/types/form_type`)
  }
}
