import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { PractitionerAdditionalQualification } from './additional_qualification_model';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { getToday } from 'src/app/shared/utils/dates';
import { EditAdditionalQualificationComponent } from './edit-additional-qualification/edit-additional-qualification.component';
import { LicenseObject } from '../../models/license_model';

@Component({
  selector: 'app-additional-qualifications',
  templateUrl: './additional-qualifications.component.html',
  styleUrls: ['./additional-qualifications.component.scss']
})
export class AdditionalQualificationsComponent implements OnChanges {
  @Input() practitioner!: LicenseObject;
  baseUrl: string = "practitioners/qualifications";
  url: string = "practitioners/qualifications";
  ts: string = "";
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.url = `practitioners/qualifications?registration_number=${this.practitioner.license_number}`;
  }


  getActions = (object: PractitionerAdditionalQualification): DataActionsButton[] => {
    const actions: DataActionsButton[] = [

    ];
    if (!object.deleted_at) {
      actions.push(
        { label: "Edit", type: "button", onClick: (object: PractitionerAdditionalQualification) => this.edit(object) },
        { label: "Delete", type: "button", onClick: (object: PractitionerAdditionalQualification) => this.delete(object) }
      )
    }
    else {
      actions.push(
        { label: "Restore", type: "button", onClick: (object: PractitionerAdditionalQualification) => this.restore(object) }
      )
    }
    return actions;
  }


  edit(object: PractitionerAdditionalQualification) {
    const dialogRef = this.dialog.open(EditAdditionalQualificationComponent, {
      data: { object: object, practitioner: this.practitioner },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }

  create() {
    const dialogRef = this.dialog.open(EditAdditionalQualificationComponent, {
      data: { object: null, practitioner: this.practitioner },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }


  delete(object: PractitionerAdditionalQualification) {
    if (!window.confirm('Are you sure you want to deactivate this entry? ')) {
      return;
    }
    this.dbService.delete<{ message: string }>("practitioners/qualifications/" + object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  restore(object: PractitionerAdditionalQualification) {
    if (!window.confirm('Are you sure you want to restore this qualification?')) {
      return;
    }
    this.dbService.put<{ message: string }>("practitioners/qualifications/" + object.uuid + "/restore", {}).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }
}
