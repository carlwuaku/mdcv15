import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PractitionerObject } from './models/practitioner_model';

@Component({
  selector: 'app-practitioners',
  templateUrl: './practitioners.component.html',
  styleUrls: ['./practitioners.component.scss']
})
export class PractitionersComponent {
  constructor(private dbService: HttpService, private notify:NotifyService){}
  baseUrl: string = "practitioners/practitioners";
  url: string = "practitioners/practitioners?withDeleted=yes";
  ts: string = "";

  getActions = (role: PractitionerObject): DataActionsButton[]=> {

    const actions: DataActionsButton[] = [

    ];

    // if (role.deleted_at !== null) {
    //   actions.push(
    //     { label: "Activate", type: "button", onClick: (role: Role) => this.activate(role) }
    //   )
    // }
    // else {
    //   actions.push(
    //     { label: "Edit details", type: "link", link: `admin/role-form/`, linkProp: 'role_id' },
    //     { label: "Edit permissions", type: "link", link: `admin/role-permissions/`, linkProp: 'role_id' },
    //     { label: "Deactivate", type: "button", onClick: (role: Role) => this.deleteRole(role)}
    //   )
    // }
    return actions;
  }

  // activate(role: Role){
  //   if (!window.confirm('Are you sure you want to re-activate this role?')) {
  //     return;
  //   }
  //   this.dbService.put<{message:string}>("admin/roles/" + role.role_id + "/restore", { }).subscribe({
  //     next: response => {
  //       this.notify.successNotification(response.message);
  //        this.updateTimestamp(); },
  //     error: error => {  }
  //   })
  // }

  // deleteRole (role: Role) {
  //   if (!window.confirm('Are you sure you want to deactivate this role? This will prevent the role from receiving new users, but will not affect existing users. You will be able to restore it')) {
  //     return;
  //   }
  //   this.dbService.delete<{message:string}>("admin/roles/" + role.role_id).subscribe({
  //     next: response => {
  //       this.notify.successNotification(response.message);
  //        this.updateTimestamp(); },
  //     error: error => {  }
  //   })
  // }
  // updateTimestamp(){
  //   this.ts = getToday("timestamp_string");
  // }

  setSelectedItems(objects: PractitionerObject[]) { }
}
