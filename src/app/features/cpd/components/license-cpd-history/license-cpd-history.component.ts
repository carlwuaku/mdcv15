import { Component, Input, OnInit } from '@angular/core';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { CpdAttendanceObject } from '../../models/cpd_attendance_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { CpdService } from '../../cpd.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';

@Component({
    selector: 'app-license-cpd-history',
    templateUrl: './license-cpd-history.component.html',
    styleUrls: ['./license-cpd-history.component.scss'],
    standalone: false
})
export class LicenseCpdHistoryComponent implements OnInit, DataListComponentInterface<CpdAttendanceObject> {

  @Input() baseUrl: string = "cpd/attendance";
  @Input() url: string = "cpd/attendance";
  @Input() ts: string = "";
  selectedItems: CpdAttendanceObject[] = [];
  @Input() licenseNumber: string = "";
  @Input() year: string = "";
  _year: string = "";
  score: number = 0;
  getActions = (object: CpdAttendanceObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View practitioner", type: "link", link: `licenses/license-details/`, linkProp: 'license_uuid' },
      { label: "View topic", type: "link", link: `cpd/details`, linkProp: 'cpd_uuid' },
      { label: "Delete", type: "button", onClick: (object: CpdAttendanceObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: CpdAttendanceObject[]): void {
    this.selectedItems = objects;
  }
  specialClasses: Record<string, string> = {};

  constructor(private cpdService: CpdService, private notify: NotifyService) {
    this._year = new Date().getFullYear().toString();
    this.year = this._year;
  }
  ngOnInit(): void {

    this.setUrl();
  }

  onYearChange() {
    this.year = this._year;
    this.setUrl();
  }

  setUrl(): void {
    this.url = this.baseUrl;
    let extra = [];
    extra.push(`license_number=${this.licenseNumber}`);

    extra.push(`year=${this.year}`);

    this.url += `?${extra.join('&')}`;

  }

  onDataDownloaded(data: ApiResponseObject<{ score: number, attendance: CpdAttendanceObject[] }>) {
    this.score = data.data.score;
  }

  delete(object: CpdAttendanceObject) {
    if (!window.confirm(`Are you sure you want to delete attendance for ${object.license_number}? `)) {
      return;
    }
    this.cpdService.deleteCpdAttendance(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }
}
