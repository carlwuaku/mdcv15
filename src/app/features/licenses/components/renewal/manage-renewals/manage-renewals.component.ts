import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute } from '@angular/router';
import { LicenseObject } from '../../../models/license_model';
import { RenewalService } from '../../../renewal.service';
import { RenewalObject } from '../renewal.model';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
@Component({
    selector: 'app-manage-renewals',
    templateUrl: './manage-renewals.component.html',
    styleUrls: ['./manage-renewals.component.scss'],
    standalone: false
})
export class ManageRenewalsComponent {
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  @Input() license: LicenseObject | undefined = undefined;
  queryParams: { [key: string]: string } = {};
  action: string = "renewal";
  selectedItems: RenewalObject[] = [];
  licenseType: string = "";
  requiredFields: IFormGenerator[] = [];
  canApprove: boolean = false;
  providedData: IFormGenerator[] = [];
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute, private appService: AppService,
    private authService: AuthService) {
    //get query params for status and license_type
    this.ar.queryParams.subscribe(params => {
      this.queryParams = params;
    });


  }
  ngOnInit(): void {
    this.setUrl();
    this.appService.appSettings.subscribe(data => {
      const stageConfig = data?.licenseTypes[this.queryParams['license_type']]?.renewalStages[this.queryParams['status']];
      if (!stageConfig) {
        return;
      }
      this.action = stageConfig.next;
      this.requiredFields = stageConfig.fields;
      //can approve if any of the stage config canApprovePermissions is in the user's permissions
      this.canApprove = stageConfig.canApprovePermissions.some((permission: string) => this.authService.currentUser?.permissions.includes(permission));
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setUrl();
  }

  setUrl() {
    let queryParams = "";
    Object.keys(this.queryParams).forEach(key => {
      queryParams += queryParams === "" ? "?" : "&";
      queryParams += `${key}=${this.queryParams[key]}`;
    });
    if (this.license) {
      this.url = this.baseUrl + "/license/" + this.license.uuid + queryParams;
    }
    else {
      this.url = this.baseUrl + queryParams;
    }
  }

  getActions = (object: RenewalObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `licenses/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: RenewalObject) => this.delete(object) }
    ];
    if (!this.license) {
      actions.unshift(
        { label: "View license", type: "link", link: `licenses/license-details/`, linkProp: 'license_uuid' }
      )
    }
    if (object.status === "Approved") {
      actions.push(
        { label: "Print Certificate", type: "link", link: `licenses/renewal-certificate/`, linkProp: 'uuid' }
      )
    }

    if (object.status === "Pending Approval") {
      actions.push(
        { label: "Set to Pending Payment", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Pending Payment", "license_number": object.license_number, "license_uuid": object.license_uuid }) }
      )
    }
    if (object.status !== "Approved") {
      actions.push(
        { label: "Approve", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Approved", "license_number": object.license_number, "license_uuid": object.license_uuid }) }
      )
    }

    if (object.status === "Pending Payment") {
      actions.push(
        {
          label: "Set to Pending Approval", type: "button", onClick: (object: RenewalObject) => this.update(object,
            { "status": "Pending Approval", "license_number": object.license_number, "license_uuid": object.license_uuid })
        }
      )
    }


    return actions;
  }
  delete(object: RenewalObject) {
    this.renewalService.delete(object.uuid).subscribe({
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

  update(object: RenewalObject, data: { [key: string]: string }) {
    if (!window.confirm('Are you sure you want to update this entry? ')) {
      return;
    }
    this.renewalService.update(object.uuid, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  setSelectedItems(items: RenewalObject[]) {
    this.selectedItems = items;
  }

  approve() {
    //if there are required fields, show the dialog form
    if (this.requiredFields.length) {
      this.dialog.open(DialogFormComponent, {
        data: {
          fields: this.requiredFields, title: `Please provide the following data. This will apply to all ${this.selectedItems.length} selected item(s)`, formType: "filter"
        },
        height: '90vh',
        width: '90vw'
      }).afterClosed().subscribe((data: IFormGenerator[]) => {
        //get an object of the name and value of the fields
        if (!data) {
          return;
        }
        this.providedData = data;
        this.submit();


      })
    }
  }

  submit() {
    const data: Record<string, any>[] = [];
    const supplementaryData = this.providedData.reduce((acc: Record<string, any>, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
    this.selectedItems.forEach(item => {
      data.push({
        uuid: item.uuid, status: this.action,
        license_type: item.license_type, license_number: item.license_number,
        id: item.id, ...supplementaryData
      });
    });

    this.renewalService.updateBulkForStage(data, this.action).subscribe({
      next: response => {
        let successful = 0;
        let failed = 0;
        response.data.forEach(element => {
          if (element.successful) {
            successful++
          }
          else {
            failed++
          }
        });
        if (failed) {
          this.notify.failNotification(` ${failed} failed to be updated`);
        }
        if (successful) {
          this.notify.successNotification(`${successful} updated successfully`);
        }
        this.ts = getToday("timestamp_string");
      },
      error: error => { }
    })
  }
}
