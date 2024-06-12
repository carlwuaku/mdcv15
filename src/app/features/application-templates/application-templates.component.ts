import { Component, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DialogKeyValueDisplayComponent } from 'src/app/shared/components/dialog-key-value-display/dialog-key-value-display.component';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ApplicationFormObject } from '../application-forms/models/application-form.model';
import { RenewalService } from '../practitioners/renewal.service';
import { ApplicationTemplatesService } from './application-templates.service';

@Component({
  selector: 'app-application-templates',
  templateUrl: './application-templates.component.html',
  styleUrls: ['./application-templates.component.scss']
})
export class ApplicationTemplatesComponent {
  baseUrl: string = "applications/templates";
  url: string = "applications/templates";
  ts: string = "";

  constructor(private dbService: HttpService, private notify:NotifyService, public dialog: MatDialog,
    private templateService: ApplicationTemplatesService, private ar: ActivatedRoute) {


  }
  ngOnInit(): void {
    this.setUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setUrl();
  }

  setUrl(){


      this.url = this.baseUrl;

  }

  getActions = (object: ApplicationFormObject): DataActionsButton[]=> {

    const actions: DataActionsButton[] = [
      { label: "Preview", type: "link", link: `application-templates/preview/`, linkProp: 'uuid' },
      { label: "Edit", type: "link", link: `application-templates/form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: ApplicationFormObject) => this.delete(object)}
    ];

    return actions;
  }
  delete (object: ApplicationFormObject) {
    this.templateService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
         this.updateTimestamp(); },
      error: error => {  }
    })
  }


  view (object: ApplicationFormObject) {
    //remove the actions from the object
    const data = {...object};
    delete data.actions;
    this.dialog.open(DialogKeyValueDisplayComponent, {
      data: {object:data, title: "Application Form"},
      maxHeight: '90vh',
      maxWidth: '90vw'

    })
  }

  updateTimestamp(){
    this.ts = getToday("timestamp_string");
  }


}
