import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalObject } from './renewal.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { PractitionerObject } from '../../models/practitioner_model';
import { RenewalService } from '../../renewal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnChanges{
  baseUrl: string = "practitioners/renewal";
  url: string = "practitioners/renewal";
  ts: string = "";
  @Input() practitioner: PractitionerObject | undefined = undefined;
  practitioner_type: "Doctor"|"Physician Assistant" = "Doctor";
  status: "Pending Approval" | "Pending Payment" | "Approved" = "Approved";
  constructor(private dbService: HttpService, private notify:NotifyService, public dialog: MatDialog,
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

        default:
          this.status = "Approved";
          break;
      }

  }
  ngOnChanges(changes: SimpleChanges): void {
    const queryParams = `?practitioner_type=${this.practitioner_type}&status=${this.status}`;
    if(this.practitioner){
      this.url = this.baseUrl + "/practitioner/" + this.practitioner.uuid+queryParams;
    }
    else{
      this.url = this.baseUrl + queryParams;
    }
  }



  getActions = (practitioner: RenewalObject): DataActionsButton[]=> {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `practitioners/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: RenewalObject) => this.delete(object)}
    ];
    if(!this.practitioner){
      actions.unshift(
        { label: "View Practitioner", type: "link", link: `practitioners/practitioner-details/`, linkProp: 'practitioner_uuid' }
      )
    }
    return actions;
  }
  delete (object: RenewalObject) {
    this.renewalService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }

  updateTimestamp(){
    this.ts = getToday("timestamp_string");
  }
}