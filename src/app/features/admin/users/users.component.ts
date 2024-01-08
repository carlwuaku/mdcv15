import { Component } from '@angular/core';
import { DateService } from 'src/app/core/date/date.service';
import { User } from 'src/app/core/models/user.model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  constructor(private dbService: HttpService, private dateService: DateService) { }

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

  getActions(user: User): DataActionsButton[] {


    const activate = (user: User) => {
      if (!window.confirm('Are you sure you want to activate this user? This will allow the user to login to the system')) {
        return;
      }
      this.dbService.put("admin/users/" + user.id + "/activate", { "active": 1 }).subscribe({
        next: response => { this.ts = this.dateService.getToday("timestamp_string"); },
        error: error => { }
      })
    }

    const deleteUser = (user: User) => {
      if (!window.confirm('Are you sure you want to deactivate this user? This will prevent the account from being used until you re-activate it')) {
        return;
      }
      this.dbService.delete("admin/users/" + user.id).subscribe({
        next: data => {
          this.ts = this.dateService.getToday("timestamp_string");
        },
        error: error => {

        }
      })
    }

    const deactivate = (user: User) => {
      const reason = window.prompt("Please state a reason for deactivating this user");
      const data = reason ? { "reason": reason } : {}
      this.dbService.put(`admin/users/${user.id}/deactivate`, data).subscribe({
        next: response => { this.ts = this.dateService.getToday("timestamp_string"); },
        error: error => { }
      })
    }
    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `admin/userForm/`, linkProp: 'id' },
      { label: "Delete", type: "button", onClick: (user: User) => { deleteUser(user) } },
    ];
    if (user.status !== null) {
      actions.push(
        { label: "Activate Account", type: "button", onClick: (user: User) => { activate(user) } }
      )
    }
    else {
      actions.push(
        {
          label: "Deactivate Account", type: "button", onClick: (user: User) => { deactivate(user) }
        }

      )
    }
    return actions;
  }

  setSelectedItems(users: User[]) { }

}
