import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PractitionerObject } from './models/practitioner_model';
import { MatDialog } from '@angular/material/dialog';
import { EditImageComponent } from 'src/app/shared/components/edit-image/edit-image.component';

@Component({
  selector: 'app-practitioners',
  templateUrl: './practitioners.component.html',
  styleUrls: ['./practitioners.component.scss']
})
export class PractitionersComponent {
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog) { }
  baseUrl: string = "practitioners/details";
  url: string = "practitioners/details";
  ts: string = "";
  selectedItems: PractitionerObject[] = [];

  getActions = (practitioner: PractitionerObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (practitioner.deleted_at) {
      actions.push(
        { label: "Restore", type: "button", onClick: (practitioner: PractitionerObject) => this.activate(practitioner) }
      )
    }
    else {
      actions.push(
        { label: "View", type: "link", link: `practitioners/practitioner-details/`, linkProp: 'uuid' },
        { label: "Edit", type: "link", link: `practitioners/practitioner-form/`, linkProp: 'uuid' },
        { label: "Edit picture", type: "button", onClick: (practitioner: PractitionerObject) => this.editImage(practitioner) },
        { label: "Delete", type: "button", onClick: (role: PractitionerObject) => this.delete(role) }
      )
    }
    return actions;
  }

  editImage(practitioner: PractitionerObject) {
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: {
        uuid: practitioner.uuid, picture: practitioner.picture,
        name: practitioner.first_name + practitioner.last_name, unique_id: practitioner.registration_number, updateUrl: "practitioners/details/"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }

  activate(object: PractitionerObject) {
    if (!window.confirm('Are you sure you want to restore this practitioner?')) {
      return;
    }
    this.dbService.put<{ message: string }>("practitioners/details/" + object.uuid + "/restore", {}).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  delete(practitioner: PractitionerObject) {
    if (!window.confirm('Are you sure you want to delete this practitioner? You will be able to restore it')) {
      return;
    }
    this.dbService.delete<{ message: string }>("practitioners/details/" + practitioner.uuid).subscribe({
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

  setSelectedItems(objects: PractitionerObject[]) {
    this.selectedItems = objects;
  }

  specialClasses: { [key: string]: string } =
    {
      "in_good_standing-In_Good_Standing": "badge bg-success",
      "in_good_standing-Not_In_Good_Standing": "badge bg-danger",
      "in_good_standing-Pending-Payment": "badge bg-warning",
      "in_good_standing-Pending-Approval": "badge bg-warning",
      "category-Medical": "badge bg-success",
      "category-Dental": "badge bg-info",
      "status-Alive": "badge bg-success",
      "status-Deceased": "badge bg-danger",
      "register_type-Provisional": "badge bg-danger",
      "register_type-Temporary": "badge bg-warning",
      "register_type-Permanent": "badge bg-success",
      "register_type-Full": "badge bg-success",
    }
    ;
}
