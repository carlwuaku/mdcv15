import { Component } from '@angular/core';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Role } from '../models/roles.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  canDelete: boolean = false;
  canActivate: boolean = true;
  canEdit: boolean = false;
  canEditPermissions: boolean = false;
  constructor(private dbService: HttpService, private notify: NotifyService, private authService: AuthService) {
    if (this.authService.currentUser?.permissions.includes("Delete_User_Role")) {
      this.canDelete = true;
    }
    if (this.authService.currentUser?.permissions.includes("Create_Or_Edit_User_Role")) {
      this.canActivate = true;
    }
    if (this.authService.currentUser?.permissions.includes("Create_Or_Edit_User_Role")) {
      this.canEdit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Create_Or_Delete_User_Permissions")) {
      this.canEditPermissions = true;
    }

  }
  baseUrl: string = "admin/roles";
  url: string = "admin/roles";
  ts: string = "";

  getActions = (role: Role): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (role.deleted_at && this.canActivate) {
      actions.push(
        { label: "Activate", type: "button", onClick: (role: Role) => this.activate(role) }
      )
    }
    else {
      if (this.canDelete) {
        actions.push(
          { label: "Deactivate", type: "button", onClick: (role: Role) => this.deleteRole(role) }
        )
      }

      if (this.canEdit) {
        actions.push(
          { label: "Edit details", type: "link", link: `admin/role-form/`, linkProp: 'role_id' }
        )
      }

      if (this.canEditPermissions) {
        actions.push(
          { label: "Edit permissions", type: "link", link: `admin/role-permissions/`, linkProp: 'role_id' }
        )
      }
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
