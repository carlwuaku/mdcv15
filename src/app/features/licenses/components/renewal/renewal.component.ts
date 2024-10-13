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
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit, OnChanges {
  baseUrl: string = "practitioners/renewal";
  url: string = "practitioners/renewal";
  ts: string = "";
  @Input() practitioner: LicenseObject | undefined = undefined;
  practitioner_type: "Doctor" | "Physician Assistant" = "Doctor";
  status: "" | "Pending Approval" | "Pending Payment" | "Approved" = "Approved";
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute) {
    //get query params for status and practitioner_type
    const practitioner_type = this.ar.snapshot.queryParamMap.get('practitioner_type');
    const status = this.ar.snapshot.queryParamMap.get('status');
    this.practitioner_type = practitioner_type === "Physician Assistant" ? "Physician Assistant" : "Doctor";
    switch (status) {
      case "Pending Approval":
        this.status = "Pending Approval";
        break;
      case "Pending Payment":
        this.status = "Pending Payment";
        break;
      case "Approved":
        this.status = "Approved";
        break;
      default:
        this.status = "";
        break;
    }
    console.log(practitioner_type, status)

  }
  ngOnInit(): void {
    this.setUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setUrl();
  }

  setUrl() {
    let queryParams = `?practitioner_type=${this.practitioner_type}`;
    if (this.status) {
      queryParams += `&status=${this.status}`
    }
    if (this.practitioner) {
      this.url = this.baseUrl + "/practitioner/" + this.practitioner.uuid + queryParams;
    }
    else {
      this.url = this.baseUrl + queryParams;
    }
  }

  getActions = (object: RenewalObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `practitioners/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: RenewalObject) => this.delete(object) }
    ];
    if (!this.practitioner) {
      actions.unshift(
        { label: "View Practitioner", type: "link", link: `practitioners/practitioner-details/`, linkProp: 'practitioner_uuid' }
      )
    }
    if (object.status === "Approved") {
      actions.push(
        { label: "Print Certificate", type: "link", link: `practitioners/renewal-certificate/`, linkProp: 'uuid' }
      )
    }

    if (object.status === "Pending Approval") {
      actions.push(
        { label: "Set to Pending Payment", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Pending Payment", "registration_number": object.registration_number, "practitioner_uuid": object.practitioner_uuid }) }
      )
    }
    if (object.status !== "Approved") {
      actions.push(
        { label: "Approve", type: "button", onClick: (object: RenewalObject) => this.update(object, { "status": "Approved", "registration_number": object.registration_number, "practitioner_uuid": object.practitioner_uuid }) }
      )
    }

    if (object.status === "Pending Payment") {
      actions.push(
        {
          label: "Set to Pending Approval", type: "button", onClick: (object: RenewalObject) => this.update(object,
            { "status": "Pending Approval", "registration_number": object.registration_number, "practitioner_uuid": object.practitioner_uuid })
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
