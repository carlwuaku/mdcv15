import { Component } from '@angular/core';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Role } from '../models/roles.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  constructor(private dbService: HttpService, public dateService: DateService){}
  baseUrl: string = "admin/roles";
  url: string = "admin/roles?withDeleted=yes";
  ts: string = "";

  getActions(role: Role): DataActionsButton[] {

    const self = this;
    const activate = (role: Role) => {
      if (!window.confirm('Are you sure you want to re-activate this role?')) {
        return;
      }
      this.dbService.put("admin/roles/" + role.role_id + "/restore", { }).subscribe({
        next: response => { self.ts = this.dateService.getToday("timestamp_string"); },
        error: error => { }
      })
    }

    const deleteRole = (role: Role) => {
      if (!window.confirm('Are you sure you want to deactivate this role? This will prevent the role from receiving new users, but will not affect existing users. You will be able to restore it')) {
        return;
      }
      this.dbService.delete("admin/roles/" + role.role_id).subscribe({
        next: data => {
          this.ts = this.dateService.getToday("timestamp_string");
        },
        error: error => {

        }
      })
    }


    const actions: DataActionsButton[] = [

    ];

    if (role.deleted_at !== null) {
      actions.push(
        { label: "Activate", type: "button", onClick: (role: Role) => { activate(role) } }
      )
    }
    else {
      actions.push(
        { label: "Edit details", type: "link", link: `admin/role-form/`, linkProp: 'role_id' },
        { label: "Edit permissions", type: "link", link: `admin/role-permissions/`, linkProp: 'role_id' },
        { label: "Deactivate", type: "button", onClick: (role: Role) => { deleteRole(role) } }
      )
    }
    return actions;
  }

  setSelectedItems(users: Role[]) { }
}
