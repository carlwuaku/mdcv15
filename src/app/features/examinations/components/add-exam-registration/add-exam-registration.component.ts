import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LicenseObject } from 'src/app/features/licenses/models/license_model';
import { ExaminationService } from '../../examination.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AssignIndexNumbersComponent } from '../assign-index-numbers/assign-index-numbers.component';
import { ExaminationObject } from '../../models/examination.model';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { PrepMessagingComponent } from 'src/app/shared/components/prep-messaging/prep-messaging.component';

@Component({
  selector: 'app-add-exam-registration',
  templateUrl: './add-exam-registration.component.html',
  styleUrls: ['./add-exam-registration.component.scss']
})
export class AddExamRegistrationComponent {
  selectedLicenses: LicenseObject[] = [];
  @Input() exam: ExaminationObject | undefined;
  @ViewChild('prepMessageComponent') prepMessageComponent!: PrepMessagingComponent
  @Output() onRegistrationAdded = new EventEmitter<ExaminationRegistrationObject[]>();
  constructor(private dialog: MatDialog, private service: ExaminationService, private notify: NotifyService) {

  }

  onLicenseSelected(licenses: LicenseObject[]) {
    this.selectedLicenses.push(...licenses);
    //make the list unique based on license number
    this.selectedLicenses = this.selectedLicenses.filter((l, index, self) =>
      index === self.findIndex((t) => (
        t.license_number === l.license_number
      ))
    );
  }

  setIndexNumbers() {
    if (this.selectedLicenses.length === 0) {
      this.notify.failNotification('Please select at least one practitioner');
      return;
    }
    const dialogRef = this.dialog.open(AssignIndexNumbersComponent, {
      width: '600px',
      data: { candidates: this.selectedLicenses, examId: this.exam!.id } // examId should be set appropriately
    });

    dialogRef.afterClosed().subscribe((results: ExaminationRegistrationObject[]) => {
      if (results) {
        //send emails to the registrations
        this.sendEmailsToNewlyRegistrered(results);
        this.onRegistrationAdded.emit(results);
      }
    });
  }

  clearSelectedLicenses() {
    this.selectedLicenses = [];
    this.notify.successNotification('Selected licenses cleared');
  }

  removeLicense(license: LicenseObject) {
    this.selectedLicenses = this.selectedLicenses.filter(l => l.license_number !== license.license_number);
    this.notify.successNotification('License removed successfully');
  }

  sendEmailsToNewlyRegistrered(objects: ExaminationRegistrationObject[]) {
    //ask user if they want to send emails
    if (!window.confirm("Send emails to newly registered candidates informing them of their registration?")) {
      return;
    }
    this.prepMessageComponent.objects = objects;
    this.prepMessageComponent.emailField = "email";
    this.prepMessageComponent.labelField = "first_name, last_name";
    this.prepMessageComponent.prepMailList();//uses the objects to get the emails
    this.prepMessageComponent.openDialog();
  }
}
