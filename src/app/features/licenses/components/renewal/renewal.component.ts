import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalObject } from './renewal.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute } from '@angular/router';
import { RenewalService } from '../../renewal.service';
import { LicenseObject } from '../../models/license_model';

@Component({
    selector: 'app-renewal',
    templateUrl: './renewal.component.html',
    styleUrls: ['./renewal.component.scss'],
    standalone: false
})
export class RenewalComponent implements OnInit, OnChanges {
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  @Input() license: LicenseObject | undefined = undefined;
  queryParams: { [key: string]: string } = {};
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute) {
    //get query params for status and license_type
    this.ar.queryParams.subscribe(params => {
      this.queryParams = params;
    });


  }
  ngOnInit(): void {
    this.setUrl();
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
}
