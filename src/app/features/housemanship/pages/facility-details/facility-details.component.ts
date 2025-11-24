import { Component, OnInit, ViewChild } from '@angular/core';
import { HousemanshipFacility } from '../../models/Housemanship_facility.model';
import { HousemanshipService } from '../../housemanship.service';
import { ActivatedRoute } from '@angular/router';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { InstitutionUsersService } from 'src/app/features/admin/services/institution-users.service';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: HousemanshipFacility;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = []
  postingHistoryQueryParams: { [key: string]: string } = {};
  usersListUrl: string = "";
  usersTimestamp: string = "";
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  constructor(
    private service: HousemanshipService,
    private ar: ActivatedRoute,
    private dialog: MatDialog,
    private notify: NotifyService,
    private institutionUsersService: InstitutionUsersService
  ) {
    this.id = ar.snapshot.params['id'];
  }

  ngOnInit() {
    this.getDetails();

  }



  getDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.service.getFacilityDetails(this.id).subscribe({
      next: data => {
        this.object = data.data;
        this.postingHistoryQueryParams['facility_name'] = this.object.name;
        this.displayedColumns = data.displayColumns;
        this.usersListUrl = `admin/users?institution_uuid=${this.id}&institution_type=housemanship_facility`;
        this.isLoading = false;
        this.errorLoadingData = false;

      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

  filterSubmitted(filters: { [key: string]: string }) {
    this.postingHistoryQueryParams = { ...filters, ...this.postingHistoryQueryParams };
  }

  openCreateUserDialog() {
    const fields: IFormGenerator[] = [
      {
        label: "First Name",
        name: "first_name",
        hint: "",
        options: [],
        type: "text",
        value: "",
        required: true
      },
      {
        label: "Last Name",
        name: "last_name",
        hint: "",
        options: [],
        type: "text",
        value: "",
        required: true
      },
      {
        label: "Email",
        name: "email",
        hint: "User will receive login credentials at this email",
        options: [],
        type: "email",
        value: "",
        required: true
      },
      {
        label: "Phone",
        name: "phone",
        hint: "",
        options: [],
        type: "text",
        value: "",
        required: true
      }
    ];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '600px',
      data: {
        fields: fields,
        formType: 'submit',
        title: 'Create Institution User',
        url: 'admin/users/institution',
        extraData: [
          { key: 'institution_uuid', value: this.id },
          { key: 'institution_type', value: 'housemanship_facility' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createInstitutionUser(result);
      }
    });
  }

  createInstitutionUser(formData: IFormGenerator[]) {
    const userData: any = {};
    formData.forEach(field => {
      userData[field.name] = field.value;
    });

    this.institutionUsersService.createInstitutionUser(userData).subscribe({
      next: (response) => {
        this.notify.successNotification(`User created successfully. Username: ${response.data.username}`);
        this.refreshUsersList();
      },
      error: (error: any) => {
        this.notify.failNotification(error.error?.message || 'Failed to create user');
      }
    });
  }

  refreshUsersList() {
    this.usersTimestamp = new Date().getTime().toString();
  }

  getUserActions = (user: any): DataActionsButton[] => {
    const actions: DataActionsButton[] = [];

    if (user.active === '1' || user.active === 1) {
      actions.push({
        label: "Deactivate",
        type: "button",
        onClick: (user: any) => this.deactivateUser(user)
      });
    } else {
      actions.push({
        label: "Activate",
        type: "button",
        onClick: (user: any) => this.activateUser(user)
      });
    }

    actions.push({
      label: "Delete",
      type: "button",
      onClick: (user: any) => this.deleteUser(user)
    });

    return actions;
  }

  activateUser(user: any) {
    this.institutionUsersService.activateUser(user.id).subscribe({
      next: () => {
        this.notify.successNotification('User activated successfully');
        this.refreshUsersList();
      },
      error: (error: any) => {
        this.notify.failNotification(error.error?.message || 'Failed to activate user');
      }
    });
  }

  deactivateUser(user: any) {
    this.institutionUsersService.deactivateUser(user.id).subscribe({
      next: () => {
        this.notify.successNotification('User deactivated successfully');
        this.refreshUsersList();
      },
      error: (error: any) => {
        this.notify.failNotification(error.error?.message || 'Failed to deactivate user');
      }
    });
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.institutionUsersService.deleteUser(user.id).subscribe({
        next: () => {
          this.notify.successNotification('User deleted successfully');
          this.refreshUsersList();
        },
        error: (error: any) => {
          this.notify.failNotification(error.error?.message || 'Failed to delete user');
        }
      });
    }
  }
}
