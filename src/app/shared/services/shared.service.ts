import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private dbService: HttpService) { }

  uploadDocx(file: File) {
    const formData = new FormData();
    formData.append('docxFile', file);
    return this.dbService.post<{ data: string }>('print-queue/templates/upload-docx', formData);
  }
}
