import { Component, EventEmitter } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  constructor(private dbService: HttpService, private notify:NotifyService) {
    this.updateTimestampEvent.subscribe(() => {
      this.updateTimestamp();
    });
  }
  updateTimestampEvent: EventEmitter<void> = new EventEmitter();
  columnDefs = [
    {
      headerName: '#',
      valueGetter: "node.rowIndex + 1",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },

    {
      headerName: ' Name', field: 'username', sortable: true, filter: true,

    },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    { headerName: 'Region', field: 'regionId', sortable: true, filter: true },
    { headerName: 'Active', field: 'active', sortable: true, filter: true }


  ];



  baseUrl: string = "admin/users";
  url: string = "admin/users";
  ts: string = "";

  getActions = (user: User): DataActionsButton[] => {
    const actions: DataActionsButton[] = [];
    if (user.status !== null) {
      actions.push(
        { label: "Activate Account", type: "button", onClick: (user: User) => this.activate(user) }
      )
    }
    else {
      actions.push(
        { label: "Edit", type: "link", link: `admin/userForm/`, linkProp: 'id' },
        {
          label: "Deactivate Account", type: "button", onClick: (user: User) => this.deactivate(user)
        }

      )
    }
    return actions;
  }

  updateTimestamp(){
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(users: User[]) { }

  deactivate(user: User) {
    const reason = window.prompt("Please state a reason for deactivating this user");
    const data = reason ? { "reason": reason } : {}
    this.dbService.put<{message: string}>(`admin/users/${user.id}/deactivate`, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }

  deleteUser (user: User) {
    if (!window.confirm('Are you sure you want to deactivate this user? This will prevent the account from being used until you re-activate it')) {
      return;
    }
    this.dbService.delete<{message:string}>("admin/users/" + user.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }

  activate (user: User) {
    if (!window.confirm('Are you sure you want to activate this user? This will allow the user to login to the system')) {
      return;
    }
    this.dbService.put<{message:string}>("admin/users/" + user.id + "/activate", { "active": 1 }).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }
}
