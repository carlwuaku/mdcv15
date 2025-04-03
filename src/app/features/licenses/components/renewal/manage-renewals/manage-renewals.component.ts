import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseObject } from '../../../models/license_model';
import { RenewalService } from '../../../renewal.service';
import { RenewalObject } from '../renewal.model';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { Subject, take, takeUntil } from 'rxjs';
import { RenewalStageItems } from 'src/app/shared/utils/data';
@Component({
  selector: 'app-manage-renewals',
  templateUrl: './manage-renewals.component.html',
  styleUrls: ['./manage-renewals.component.scss']
})
export class ManageRenewalsComponent implements OnInit, OnDestroy {
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  @Input() license: LicenseObject | undefined = undefined;
  queryParams: { [key: string]: string } = {};
  actions: string[] = [];
  selectedItems: RenewalObject[] = [];
  licenseType: string = "";
  requiredFields: IFormGenerator[] = [];
  canApprove: boolean = false;
  providedData: IFormGenerator[] = [];
  destroy$: Subject<boolean> = new Subject();
  status: string = "";
  allStatuses: RenewalStageItems[] = [];
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute, private appService: AppService,
    private authService: AuthService, private router: Router) {



  }
  ngOnInit(): void {
    //get query params for status and license_type
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.queryParams = params
      this.licenseType = params['license_type'];
      this.setUrl();
    });

    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {

      const stages = data?.licenseTypes[this.licenseType]?.renewalStages;
      if (!stages) {
        return;
      }
      this.status = this.queryParams['status'];
      const stageConfig = stages[this.status];

      if (!stageConfig) {
        return;
      }
      const otherStatuses = Object.values(stages).filter((status) => status.title !== this.status);


      this.allStatuses = otherStatuses.filter((status) => stageConfig.allowedTransitions.includes(status.title) && this.authService.currentUser?.permissions.includes(status.permission));

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



    return actions;
  }
  delete(object: RenewalObject) {
    this.renewalService.delete(object.uuid).pipe(takeUntil(this.destroy$)).subscribe({
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
    this.renewalService.update(object.uuid, data).pipe(takeUntil(this.destroy$)).subscribe({
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

  approve(status: RenewalStageItems) {
    this.requiredFields = status.fields
    //if there are required fields, show the dialog form
    if (this.requiredFields.length > 0) {
      this.dialog.open(DialogFormComponent, {
        data: {
          fields: this.requiredFields, title: `Please provide the following data. This will apply to all ${this.selectedItems.length} selected item(s)`, formType: "filter"
        },
        height: '90vh',
        width: '90vw'
      }).afterClosed().subscribe((data: IFormGenerator[]) => {
        //get an object of the name and value of the fields
        if (!data) {
          this.notify.failNotification("Please provide the required data");
          return;
        }
        this.providedData = data;
        this.submit(status.title);
      })
    }
    else {
      this.submit(status.title);
    }

  }

  submit(status: string) {
    const data: Record<string, any>[] = [];
    const supplementaryData = this.providedData.reduce((acc: Record<string, any>, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
    this.selectedItems.forEach(item => {
      data.push({
        uuid: item.uuid, status: status,
        license_type: item.license_type, license_number: item.license_number,
        id: item.id, ...supplementaryData
      });
    });

    this.renewalService.updateBulkRenewals(data, status).pipe(takeUntil(this.destroy$)).subscribe({
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

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewals-manage'], { queryParams: { license_type: selectedValue } });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
