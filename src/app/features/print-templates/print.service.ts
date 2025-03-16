import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Template } from '../../shared/components/print-table/Template.model';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private dbService: HttpService) { }

  getTemplates() {
    return this.dbService.get<{ data: Template[] }>('print-queue/templates');
  }



  uploadDocx(file: File) {
    const formData = new FormData();
    formData.append('docxFile', file);
    return this.dbService.post<{ data: string }>('print-queue/templates/upload-docx', formData);
  }

  deleteTemplate(uuid: string) {
    return this.dbService.delete(`print-queue/templates/${uuid}`);
  }

  printSelection(objects: any[], template_uuid: string) {
    return this.dbService.post(`print-queue/templates/${template_uuid}/print-selection`, { objects });
  }


}
