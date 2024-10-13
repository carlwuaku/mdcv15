import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { getToday } from 'src/app/shared/utils/dates';
import { PractitionerWorkHistory } from './work_history_model';
import { EditWorkHistoryComponent } from './edit-work-history/edit-work-history.component';
import { LicenseObject } from '../../models/license_model';
@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnChanges {
  @Input() practitioner!: LicenseObject;
  baseUrl: string = "practitioners/workhistory";
  url: string = "practitioners/workhistory";
  ts: string = "";
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.url = `practitioners/workhistory?registration_number=${this.practitioner.license_number}`;
  }


  getActions = (object: PractitionerWorkHistory): DataActionsButton[] => {
    const actions: DataActionsButton[] = [

    ];
    if (!object.deleted_at) {
      actions.push(
        { label: "Edit", type: "button", onClick: (object: PractitionerWorkHistory) => this.edit(object) },
        { label: "Delete", type: "button", onClick: (object: PractitionerWorkHistory) => this.delete(object) }
      )
    }
    else {
      actions.push(
        { label: "Restore", type: "button", onClick: (object: PractitionerWorkHistory) => this.restore(object) }
      )
    }
    return actions;
  }


  edit(object: PractitionerWorkHistory) {
    const dialogRef = this.dialog.open(EditWorkHistoryComponent, {
      data: { object: object, practitioner: this.practitioner },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }

  create() {
    const dialogRef = this.dialog.open(EditWorkHistoryComponent, {
      data: { object: null, practitioner: this.practitioner },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }


  delete(object: PractitionerWorkHistory) {
    if (!window.confirm('Are you sure you want to deactivate this entry? ')) {
      return;
    }
    this.dbService.delete<{ message: string }>("practitioners/workhistory/" + object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  restore(object: PractitionerWorkHistory) {
    if (!window.confirm('Are you sure you want to restore this entry?')) {
      return;
    }
    this.dbService.put<{ message: string }>("practitioners/workhistory/" + object.uuid + "/restore", {}).subscribe({
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
