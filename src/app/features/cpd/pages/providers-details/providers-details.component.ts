import { Component, OnDestroy, OnInit } from '@angular/core';
import { CpdProviderObject } from '../../models/cpd_facility_model';
import { CpdService } from '../../cpd.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { InstitutionUsersService } from 'src/app/features/admin/services/institution-users.service';

@Component({
  selector: 'app-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ProvidersDetailsComponent implements OnInit, OnDestroy {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: CpdProviderObject;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = [];
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  cpdListBaseUrl: string = `cpd/details`;
  cpdListUrl: string = "";
  usersListUrl: string = "";
  usersTimestamp: string = "";

  constructor(
    private cpdService: CpdService,
    private notify: NotifyService,
    private ar: ActivatedRoute,
    private dialog: MatDialog,
    private institutionUsersService: InstitutionUsersService
  ) {
    this.id = ar.snapshot.params['id'];
  }

  ngOnInit() {

    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      if (!params.get('id')) {
        this.notify.failNotification('Please select a CPD provider');
        return;
      }
      this.id = params.get('id')!;
      this.queryParams = queryParams;
      this.getDetails();
      this.updateCpdListUrl();
    });
  }

  getDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.cpdService.getCpdProviderDetails(this.id).subscribe({
      next: data => {
        this.object = data.data;
        this.displayedColumns = data.displayColumns;
        this.isLoading = false;
        this.errorLoadingData = false;

      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

  filterChanged(filters: { [key: string]: string }) {
    this.queryParams = { ...filters };
    this.updateCpdListUrl();
  }

  updateCpdListUrl() {
    this.cpdListUrl = `${this.cpdListBaseUrl}?provider_uuid=${this.id}&` + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    this.usersListUrl = `admin/users?institution_uuid=${this.id}&institution_type=cpd_provider`;
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
          { key: 'institution_type', value: 'cpd_provider' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.createInstitutionUser(result);
        this.refreshUsersList()
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
