import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Template } from '../../shared/components/print-table/Template.model';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private dbService: HttpService) { }

  getTemplates() {
    return this.dbService.get<{ data: Template[] }>('templates');
  }

  createTemplate(template: Template) {
    return this.dbService.post<{ data: Template }>('templates', template);
  }

  uploadDocx(file: File) {
    const formData = new FormData();
    formData.append('docxFile', file);
    return this.dbService.post<{ data: string }>('templates/upload-docx', formData);
  }


}
