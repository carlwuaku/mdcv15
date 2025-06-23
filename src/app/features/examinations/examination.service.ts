import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { ExaminationObject } from './models/examination.model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ExaminationPublishResultObject, ExaminationRegistrationObject, ExaminationResultObject } from './models/examination-registration.model';
import { ExaminationApplicationObject } from './models/examination-application.model';
@Injectable({
  providedIn: 'root'
})
export class ExaminationService {

  constructor(private dbService: HttpService) { }

  getExaminationsList(): Observable<ApiResponseObject<ExaminationObject[]>> {
    return this.dbService.get('examinations/details');
  }

  deleteExamination(object: ExaminationObject): Observable<{ message: string }> {
    return this.dbService.delete<{ message: string }>("examinations/details/" + object.uuid).pipe(take(1));
  }

  getExaminationFormFields(): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get<{ data: IFormGenerator[] }>('examinations/config/form').pipe(take(1));
  }

  submitExaminationForm(data: Record<string, any>, uuid?: string): Observable<{ message: string }> {
    if (uuid) {
      return this.dbService.put<{ message: string }>('examinations/details/' + uuid, data).pipe(take(1));
    }
    return this.dbService.post<{ message: string }>('examinations/details', data).pipe(take(1));
  }

  getExamDetails(id: string): Observable<{ data: ExaminationObject }> {
    return this.dbService.get<{ data: ExaminationObject }>('examinations/details/' + id).pipe(take(1));
  }

  addExamRegistrations(data: { exam_id: string, index_number: string, intern_code: string }[]): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>('examinations/registrations', { data }).pipe(take(1));
  }

  updateExamRegistration(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>('examinations/registrations/' + uuid, { data }).pipe(take(1));
  }

  getExaminationRegistrationsList(filters: string = ''): Observable<ApiResponseObject<ExaminationRegistrationObject[]>> {
    return this.dbService.get<ApiResponseObject<ExaminationRegistrationObject[]>>('examinations/registrations' + (filters ? `?${filters}` : '')).pipe(take(1));
  }

  getExaminationResultCounts(id: string): Observable<{ not_set: number, fail: number, pass: number }> {
    return this.dbService.get<{ not_set: number, fail: number, pass: number }>(`examinations/registrations/${id}/result-count`).pipe(take(1));
  }

  getCandidateRegistrationLetter(uuid: string): Observable<string> {
    return this.dbService.get<string>(`examinations/registrations/${uuid}/letter/registration`).pipe(take(1));
  }


  deleteExaminationRegistration(uuid: string): Observable<{ message: string }> {
    return this.dbService.delete<{ message: string }>("examinations/registrations/" + uuid).pipe(take(1));
  }

  getExaminationApplicationsList(filters: string = ''): Observable<ApiResponseObject<ExaminationApplicationObject[]>> {
    return this.dbService.get<ApiResponseObject<ExaminationApplicationObject[]>>('examinations/applications' + (filters ? `?${filters}` : '')).pipe(take(1));
  }

  deleteExaminationApplication(id: string): Observable<{ message: string }> {
    return this.dbService.delete<{ message: string }>("examinations/applications/" + id).pipe(take(1));
  }

  removeCustomLetter(id: string, type: "registration" | "result"): Observable<{ message: string }> {
    const letterType = type === 'registration' ? 'registration_letter' : 'result_letter';
    return this.dbService.put<{ message: string }>(`examinations/registrations/${id}`, { data: { [letterType]: null } }).pipe(take(1));
  }

  setResults(data: ExaminationResultObject[]): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>('examinations/registrations/result', { data }).pipe(take(1));
  }

  removeResults(uuid: string): Observable<{ message: string }> {
    return this.dbService.delete<{ message: string }>(`examinations/registrations/${uuid}/result`).pipe(take(1));
  }

  publishResults(data: ExaminationPublishResultObject[]): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>('examinations/registrations/result/publish', { data }).pipe(take(1));
  }

  unpublishResults(data: ExaminationPublishResultObject[]): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>('examinations/registrations/result/unpublish', { data }).pipe(take(1));
  }
}
