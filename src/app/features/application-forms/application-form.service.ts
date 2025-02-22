import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApplicationTemplateObject, ApplicationTemplateStageObject } from '../../shared/types/application-template.model';
import { ApplicationFormObject, ApplicationTypeCounts } from './models/application-form.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationFormService {

  constructor(private dbService: HttpService) {

  }

  getApplicationDetails(uuid: string): Observable<{ data: ApplicationFormObject }> {
    return this.dbService.get(`applications/details/${uuid}`)
  }



  delete(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this application permanently? You cannot undo this action.')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{ message: string }>("applications/details/" + uuid)
  }

  update(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("uuid", uuid);
    return this.dbService.put(`applications/details/${uuid}`, formData)
  }

  finish(uuid: string, decision: "approve" | "deny", data: { [key: string]: any }): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>(`applications/details/${uuid}/${decision}`, data)
  }

  getApplicationForm(uuid: string): Observable<{ data: ApplicationTemplateObject }> {
    return this.dbService.get(`applications/templates/${uuid}`)
  }

  getApplicationFormConfig(form_type: string, config_type?: string): Observable<{ data: { [key: string]: any } }> {
    return this.dbService.get(`applications/config/${form_type}/${config_type ? config_type : ""}`)
  }

  getFormTemplateFromApplication(uuid: string): Observable<{ data: ApplicationTemplateObject }> {
    return this.getApplicationDetails(uuid).pipe(
      switchMap((data) => {
        return this.dbService.get<{ data: ApplicationTemplateObject }>(`applications/templates/${data.data.form_type}`)
      })
    )
  }

  getFormStatusCounts(url: string): Observable<{ data: ApplicationTypeCounts[], displayColumns: string[] }> {
    return this.dbService.get(url)
  }

  getApplicationTemplateStatuses(formType: string): Observable<{ data: ApplicationTemplateStageObject[] }> {
    return this.dbService.get(`applications/status/${formType}`)
  }

  updateApplicationsStatus(form_type: string, applicationIds: string[], status: string): Observable<{ message: string }> {
    const data = { form_type, applicationIds, status }
    return this.dbService.put(`applications/status`, data)
  }
}
