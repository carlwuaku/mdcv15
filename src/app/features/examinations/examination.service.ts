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

  getExaminationResultCounts(id: string): Observable<{ not_set: number, fail: number, pass: number, absent: number, total: number }> {
    return this.dbService.get<{ not_set: number, fail: number, pass: number, absent: number, total: number }>(`examinations/registrations/${id}/result-count`).pipe(take(1));
  }

  getCandidateLetter(uuid: string, letterType: "registration" | "result"): Observable<string> {
    return this.dbService.get<string>(`examinations/registrations/${uuid}/letter/${letterType}`).pipe(take(1));
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

  updateApplicationStatuses(data: { id: string, intern_code: string, status: string }[]): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>('examinations/applications/update-status', { data }).pipe(take(1));
  }

  downloadWordDocument(examId: string) {
    return this.dbService.getBlob(`examinations/details/${examId}/applicants`).pipe(take(1));
  }

  /**
   * Deletes multiple applications at once
   * @param data An array of UUIDs of the applications to be deleted
   * @returns An observable of ApiResponseObject<{ message: string }>, where the message is the success message
   */
  deleteMultipleApplications(data: string[]): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>('examinations/applications/delete', { data }).pipe(take(1));
  }

  /**
   * Retrieves the count of all applications for the given filters
   * @param filters Url query filters
   * @returns Observable of ApiResponseObject<number>
   */
  getExaminationApplicationsCount(filters: string = ''): Observable<ApiResponseObject<number>> {
    return this.dbService.get<ApiResponseObject<number>>('examinations/applications/count' + (filters ? `?${filters}` : '')).pipe(take(1));
  }

  uploadResultsFromCSV(examId: string, file: File): Observable<{ message: string, data: ExaminationRegistrationObject[] }> {
    const formData = new FormData();
    formData.append('uploadFile', file);
    return this.dbService.post<{ message: string, data: ExaminationRegistrationObject[] }>(`examinations/registrations/parse-csv-results/${examId}`, formData).pipe(take(1));
  }
}
