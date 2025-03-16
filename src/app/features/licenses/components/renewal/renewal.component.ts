import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalObject } from './renewal.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalService } from '../../renewal.service';
import { LicenseObject } from '../../models/license_model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit, OnChanges, OnDestroy {
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  @Input() license: LicenseObject | undefined = undefined;
  queryParams: { [key: string]: string } = {};
  licenseType: string = "";
  inlineFilters: string[] = ["start_date", "end_date"];
  destroy$: Subject<boolean> = new Subject();
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute, private router: Router) {


  }
  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;
      this.licenseType = params['license_type'];
      this.setUrl();
    });
    if (this.license) {
      this.licenseType = this.license.type
    }
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
        { label: "Set to Pending Payment", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Pending Payment", "registration_number": object.license_number, "license_uuid": object.license_uuid }) }
      )
    }
    if (object.status !== "Approved") {
      actions.push(
        { label: "Approve", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Approved", "registration_number": object.license_number, "license_uuid": object.license_uuid }) }
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

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewals'], { queryParams: { license_type: selectedValue } });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });

    paramsObject['license_type'] = this.licenseType;

    this.router.navigate(['licenses/renewals'], { queryParams: paramsObject });

  }
}
