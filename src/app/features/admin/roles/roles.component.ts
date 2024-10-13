import { Component } from '@angular/core';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Role } from '../models/roles.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  constructor(private dbService: HttpService, private notify: NotifyService) { }
  baseUrl: string = "admin/roles";
  url: string = "admin/roles";
  ts: string = "";

  getActions = (role: Role): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (role.deleted_at) {
      actions.push(
        { label: "Activate", type: "button", onClick: (role: Role) => this.activate(role) }
      )
    }
    else {
      actions.push(
        { label: "Edit details", type: "link", link: `admin/role-form/`, linkProp: 'role_id' },
        { label: "Edit permissions", type: "link", link: `admin/role-permissions/`, linkProp: 'role_id' },
        { label: "Deactivate", type: "button", onClick: (role: Role) => this.deleteRole(role) }
      )
    }
    return actions;
  }

  activate(role: Role) {
    if (!window.confirm('Are you sure you want to re-activate this role?')) {
      return;
    }
    this.dbService.put<{ message: string }>("admin/roles/" + role.role_id + "/restore", {}).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  deleteRole(role: Role) {
    if (!window.confirm('Are you sure you want to deactivate this role? This will prevent the role from receiving new users, but will not affect existing users. You will be able to restore it')) {
      return;
    }
    this.dbService.delete<{ message: string }>("admin/roles/" + role.role_id).subscribe({
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

  setSelectedItems(users: Role[]) { }
}
