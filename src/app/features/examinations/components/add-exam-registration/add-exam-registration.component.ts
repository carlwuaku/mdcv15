import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LicenseObject } from 'src/app/features/licenses/models/license_model';
import { ExaminationService } from '../../examination.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AssignIndexNumbersComponent } from '../assign-index-numbers/assign-index-numbers.component';

@Component({
  selector: 'app-add-exam-registration',
  templateUrl: './add-exam-registration.component.html',
  styleUrls: ['./add-exam-registration.component.scss']
})
export class AddExamRegistrationComponent {
  selectedLicenses: LicenseObject[] = [];
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
      data: { candidates: this.selectedLicenses, examId: '' } // examId should be set appropriately
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

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
}
