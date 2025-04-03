import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { RenewalObject } from './components/renewal/renewal.model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Observable, throwError } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { PrintTemplate } from 'src/app/shared/types/PrintTemplateInterface';

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
    return this.dbService.get(`licenses/renewal-form-fields/${type}`)
  }

  /**
   * updates multiple renewal records
   * @param data array of objects to update
   * @param stage the stage to update the objects to. can be an empty string if you want each one to maintain its current stage
   * @returns Observable<{ message: string, data: { message: string, successful: boolean, id: string }[] }>
   */
  updateBulkRenewals(data: Record<string, any>[], stage: string): Observable<{ message: string, data: { message: string, successful: boolean, id: string }[] }> {
    const formData: Record<string, any> = { data, status: stage };

    return this.dbService.put(`licenses/renewal`, formData)

  }

  printRenewals(objects: { type: string, content: string, template: string, data: RenewalObject, table_name: string, table_row_uuid: string, unique_id: string }[]): Observable<{ message: string, data: string }> {
    return this.dbService.post<{ data: string, message: string }>(`print-queue/templates/print`, { data: objects })
  }

  getPrintTemplates(templates: string[]): Observable<{ message: string, data: PrintTemplate[] }> {
    const url = `print-queue/templates?param=${templates.map(template => `${template.replace(",", " ")}`).join(',')}`;
    return this.dbService.get<{ data: PrintTemplate[], message: string }>(url);
  }
}
