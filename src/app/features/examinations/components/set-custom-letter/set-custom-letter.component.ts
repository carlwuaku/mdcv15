import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Template } from 'src/app/shared/components/print-table/Template.model';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { ExaminationService } from '../../examination.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-set-custom-letter',
  templateUrl: './set-custom-letter.component.html',
  styleUrls: ['./set-custom-letter.component.scss']
})
export class SetCustomLetterComponent implements OnInit, OnDestroy {
  title: string = "";
  buttonTitle: string = "";
  initialContent: string = "";
  templates: Template[] = [];
  destroy$: Subject<boolean> = new Subject();
  registration: ExaminationRegistrationObject | null = null;
  letterContent: string = "";
  letterType: "registration" | "result" = "registration";
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<SetCustomLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { registration: ExaminationRegistrationObject, letterType: "registration" | "result" },
    private service: ExaminationService, private notify: NotifyService) {
    this.registration = dialogData.registration;
    this.letterType = dialogData.letterType;
  }
  ngOnInit(): void {
    this.initialContent = this.letterType === 'registration' ? this.registration?.registration_letter || '' : this.registration?.result_letter || '';
    this.title = this.letterType === 'registration' ? 'Set custom registration letter' : 'Set custom result letter';

    this.buttonTitle = this.letterType === 'registration' ? 'Set custom registration letter' : 'Set custom result letter';
  }

  templatesLoaded(templates: Template[]) {
    this.templates = templates;
  }



  onTemplateChange(event: string) {
    this.initialContent = this.templates.find(t => t.template_name === event)?.template_content || this.initialContent;

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setLetterContent(content: string) {
    this.letterContent = content;
  }

  saveLetter() {
    if (this.registration) {
      this.registration.registration_letter = this.letterContent;
      const field = this.letterType === 'registration' ? 'registration_letter' : 'result_letter';

      this.service.updateExamRegistration(this.registration.id!, { [field]: this.letterContent }).subscribe(
        {
          next: (res) => {
            this.notify.successNotification(res.message);
            this.dialog.closeAll();
          },
          error: (err) => {
            this.notify.failNotification(err.error.message);
          }
        }
      );
    }
  }
}
