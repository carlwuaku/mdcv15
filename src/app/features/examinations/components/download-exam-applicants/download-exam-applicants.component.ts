import { Component, Input } from '@angular/core';
import { ExaminationObject } from '../../models/examination.model';
import { ExaminationService } from '../../examination.service';

@Component({
  selector: 'app-download-exam-applicants',
  templateUrl: './download-exam-applicants.component.html',
  styleUrls: ['./download-exam-applicants.component.scss']
})
export class DownloadExamApplicantsComponent {

  @Input() examination: ExaminationObject | undefined;
  constructor(private service: ExaminationService) { }

  downloadApplicants() {
    this.service.downloadWordDocument(this.examination!.id).subscribe({
      next: (response) => {
        const blob = response;
        const filename = this.examination!.title + "-applicants.docx" || 'document.docx';

        // Create download link
        const url = window.URL.createObjectURL(blob!);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Download failed:', error)
    });
  }
}
