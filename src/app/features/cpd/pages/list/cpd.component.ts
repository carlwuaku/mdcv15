import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { API_CPD_PATH } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-cpd',
  templateUrl: './cpd.component.html',
  styleUrls: ['./cpd.component.scss']
})
export class CpdComponent implements OnInit {
  //permissions
  can_edit: boolean = true;
  can_delete: boolean = true;

  base_url: string = `${API_CPD_PATH}/getCpds`;
  year: any
  url: string = "";
  timestamp: string = "";
  columnDefs = [
    {
      headerName: '#',
      valueGetter: "node.rowIndex + 1",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      headerName: 'Menu',
      sortable: true, cellClass: 'bordered',
      cellRenderer: 'DataListMenuButtonComponent',
      cellRendererParams: (params: ICellRendererParams) => ({
        actions: [
          { label: "View", type: "link", link: `cpd/details/${params.data.id}` },
          { label: "Edit", type: "link", link: `cpd/edit/${params.data.id}` },
          { label: "Delete", type: "button", onClick: () => { this.delete(params.data.id) } },
        ]
      }),
      filter: true
    },

    {
      headerName: 'Topic', 
      sortable: true, cellClass: 'bordered', 
      cellRenderer: 'LinkNameComponent',
      cellRendererParams: (params: ICellRendererParams) => ({
        link: `cpd/details/${params.data.id}`,
        label: params.data.topic
      }),
      filter: true
    },
    { headerName: 'Credits', field: 'credits', sortable: true, cellClass: 'bordered', filter: true },
    { headerName: 'Category', field: 'category', sortable: true, cellClass: 'bordered', filter: true },
    { headerName: 'Created On', field: 'created_on', sortable: true, cellClass: 'bordered', filter: true },

    { headerName: 'Organizer', field: 'facility_name', sortable: true, editable: true, cellClass: 'bordered', filter: true },
    {
      headerName: 'Phone', field: 'facility_phone', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    },
    {
      headerName: 'Email', field: 'email', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    },
    {
      headerName: 'No. of attendants', field: 'number_of_attendants', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    },
    {
      headerName: 'No. of sessions', field: 'number_of_sessions', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    },
    {
      headerName: 'Online', field: 'online', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    },
    {
      headerName: 'URL', field: 'url', sortable: true, editable: true, cellClass: 'bordered',
      filter: true
    }


  ];

  rowHeight  = function (params:any) {
    return 55;
  };

  constructor(private dbService: HttpService, private dateService: DateService,
    private notify: NotifyService, private authService: AuthService) {
    if (this.authService.currentUser.permissions.indexOf("Cpd.Content.Edit") == -1) {
      this.can_edit = false;
    }
    if (this.authService.currentUser.permissions.indexOf("Cpd.Content.Delete") == -1) {
      this.can_delete = false;
    }
    var date = new Date();
    this.year = date.getFullYear().toString();
    // this.dbService.setTitle("CPD Topics");
  }


  ngOnInit(): void {
    this.setUrl();
  }

  setUrl(): void{
    this.url = this.base_url + "?year=" + this.year

  }

  delete(id: string):void {
    if (!this.can_delete) {
      alert("You are not permitted to perform this action");
      return;
    }
    if (window.confirm("Sure you want to delete this cpd? You cannot undo this")) {
      this.notify.showLoading();
      let data = new FormData();

      data.append("id", id);
      this.dbService.post<any>(`${API_CPD_PATH}/deleteCpd`, data).subscribe({
        next: (data:any) => {
          this.notify.successNotification("cpd deleted successfully");
          this.timestamp = this.dateService.getToday("timestamp_string")


      }, error: (error) => {

        },
        complete: () => {
          this.notify.hideLoading();

      }});
    }
  }
}
