import { Component, OnInit } from '@angular/core';
import { CpdService } from '../../cpd.service';
import { ActivatedRoute } from '@angular/router';
import { CpdObject } from '../../models/cpd_model';
import { LicenseObject } from 'src/app/features/licenses/models/license_model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-manage-cpd-attendance',
  templateUrl: './manage-cpd-attendance.component.html',
  styleUrls: ['./manage-cpd-attendance.component.scss']
})
export class ManageCpdAttendanceComponent implements OnInit {
  cpdUuid: string;
  cpdObject: CpdObject | null = null;
  selectedLicenses: LicenseObject[] = [];
  timestamp: string = new Date().getTime().toString();
  attendanceDate: string = '';
  venue: string = '';
  constructor(private cpdService: CpdService, private ar: ActivatedRoute, private notify: NotifyService) {
    this.cpdUuid = this.ar.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getCPDObject();
  }

  getCPDObject() {
    this.cpdService.getCpdDetails(this.cpdUuid).subscribe(data => {
      this.cpdObject = data.data;
    })
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

  submitAttendance() {
    if (this.selectedLicenses.length === 0) {
      this.notify.failNotification('Please select at least one practitioner');
      return;
    }
    if (!this.attendanceDate) {
      this.notify.failNotification('Please select a date');
      return;
    }
    this.cpdService.submitCpdAttendance({
      cpd_uuid: this.cpdUuid,
      license_number: this.selectedLicenses.map(l => l.license_number),
      attendance_date: this.attendanceDate,
      venue: this.venue
    }).subscribe(data => {
      this.notify.successNotification('Attendance submitted successfully');
      this.selectedLicenses = [];
      this.timestamp = new Date().getTime().toString();
    })
  }

  setAttendanceDate(date: string) {
    this.attendanceDate = date;
  }

  removeSelectedLicense(license: LicenseObject) {
    if (!window.confirm(`Are you sure you want to remove ${license.name} from the selected licenses?`)) {
      return;
    }
    this.selectedLicenses = this.selectedLicenses.filter(l => l.license_number !== license.license_number);
    this.notify.successNotification(`${license.name}  removed`);
  }

}
