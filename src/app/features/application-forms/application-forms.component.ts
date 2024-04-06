import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ApplicationFormObject } from './models/application-form.model';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { RenewalService } from '../practitioners/renewal.service';
import { DialogKeyValueDisplayComponent } from 'src/app/shared/components/dialog-key-value-display/dialog-key-value-display.component';

@Component({
  selector: 'app-application-forms',
  templateUrl: './application-forms.component.html',
  styleUrls: ['./application-forms.component.scss']
})
export class ApplicationFormsComponent implements OnInit {
  baseUrl: string = "applications/details";
  url: string = "applications/details";
  ts: string = "";
  practitioner_type: "Doctor"|"Physician Assistant" = "Doctor";
  status: string = "Approved";
  form_type: string|null;
  constructor(private dbService: HttpService, private notify:NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute) {
      //get query params for status and practitioner_type
      const practitioner_type = this.ar.snapshot.queryParamMap.get('practitioner_type');
      const status = this.ar.snapshot.queryParamMap.get('status');
      this.form_type = this.ar.snapshot.queryParamMap.get('form_type');
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

  }
  ngOnInit(): void {
    this.setUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setUrl();
  }

  setUrl(){
    let queryParams = `?practitioner_type=${this.practitioner_type}`;
    if(this.status){
      queryParams += `&status=${this.status}`
    }
    if(this.form_type){
      queryParams += `&form_type=${this.form_type}`
    }

      this.url = this.baseUrl + queryParams;

  }

  getActions = (object: ApplicationFormObject): DataActionsButton[]=> {

    const actions: DataActionsButton[] = [
      { label: "View Details", type: "button", onClick: (object: ApplicationFormObject) => this.view(object)},
      { label: "Edit", type: "link", link: `practitioners/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: ApplicationFormObject) => this.delete(object)}
    ];

    return actions;
  }
  delete (object: ApplicationFormObject) {
    this.renewalService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }


  view (object: ApplicationFormObject) {
    this.dialog.open(DialogKeyValueDisplayComponent, {
      data: {object:object.form_data, title: "Application Form"},
      maxHeight: '90vh',
      maxWidth: '90vw'

    })
  }

  updateTimestamp(){
    this.ts = getToday("timestamp_string");
  }

  update(object: ApplicationFormObject, data:{[key:string]:string}){
    if(!window.confirm('Are you sure you want to update this entry? ')) {
      return;
    }
    this.renewalService.update(object.uuid, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }
}
