import { Component } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

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

  actions : DataActionsButton[]= [
    { label: "View", type: "link", link: `indexing/details/` },
    { label: "Edit", type: "link", link: `indexing/studentForm/` },
    { label: "Delete", type: "button", onClick: (user:User) => { this.delete(user) } },
  ]

  baseUrl: string = "admin/users";
  url: string = "admin/users";
  ts: string = "";

  setSelectedItems(users:User[]){}

  delete(user:User){
    alert(user.email)
  }
}
