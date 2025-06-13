import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { ExaminationObject } from './models/examination.model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
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

  submitExaminationForm(data: Record<string, any>): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>('examinations/details', data).pipe(take(1));
  }

  getExamDetails(id: string): Observable<ExaminationObject> {
    return this.dbService.get<ExaminationObject>('examinations/details/' + id).pipe(take(1));
  }

  addExamRegistrations(data: { exam_id: string, index_number: string, intern_code: string }[]): Observable<{ message: string }> {
    return this.dbService.post<{ message: string }>('examinations/registrations', data).pipe(take(1));
  }
}
