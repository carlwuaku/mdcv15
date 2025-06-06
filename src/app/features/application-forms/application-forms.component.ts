import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ApplicationFormObject } from './models/application-form.model';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { DialogKeyValueDisplayComponent } from 'src/app/shared/components/dialog-key-value-display/dialog-key-value-display.component';
import { ApplicationFormService } from './application-form.service';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-application-forms',
  templateUrl: './application-forms.component.html',
  styleUrls: ['./application-forms.component.scss']
})
export class ApplicationFormsComponent implements OnInit {
  baseUrl: string = "applications/details";
  url: string = "applications/details";
  ts: string = "";
  @Input() filters: IFormGenerator[] = [];
  status: any;
  form_type: any;
  hint: string = "Click the 'Filter' button to filter the list of applications";
  selectedApplications: ApplicationFormObject[] = [];
  destroy$: Subject<boolean> = new Subject();
  // practitioner_type: string = "";
  // status: string = "";
  // form_type: string | null;
  constructor(private notify: NotifyService, public dialog: MatDialog,
    private applicationService: ApplicationFormService, private ar: ActivatedRoute) {
    //get all query params and their values
    // const params:string[] = [];


  }
  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {
        Object.keys(params).map(key => {
          this.filters.push({
            name: key,
            value: params[key],
            type: "text",
            label: '',
            hint: '',
            options: [],
            required: false
          });
          if (key === "form_type") {
            this.form_type = params[key];
          }
          if (key === "status") {
            this.status = params[key];
          }
        });
      });
    // this.ar.snapshot.queryParamMap.keys.forEach(key => {
    //   this.filters.push({
    //     name: key,
    //     value: this.ar.snapshot.queryParamMap.get(key),
    //     type: "text",
    //     label: '',
    //     hint: '',
    //     options: [],
    //     required: false
    //   });
    //   if (key === "form_type") {
    //     this.form_type = this.ar.snapshot.queryParamMap.get(key);
    //   }
    //   if (key === "status") {
    //     this.status = this.ar.snapshot.queryParamMap.get(key);
    //   }
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    // this.setUrl();
  }


  getActions = (object: ApplicationFormObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "View Details", type: "button", onClick: (object: ApplicationFormObject) => this.view(object) },
      { label: "Edit", type: "link", link: `applications/application/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: ApplicationFormObject) => this.delete(object) }

    ];

    return actions;
  }
  delete(object: ApplicationFormObject) {
    this.applicationService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }


  view(object: ApplicationFormObject) {
    //remove the actions from the object
    const data = { ...object };
    delete data.actions;
    this.dialog.open(DialogKeyValueDisplayComponent, {
      data: { object: data, title: "Application Form" },
      maxHeight: '90vh',
      maxWidth: '90vw'
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  update(object: ApplicationFormObject, data: { [key: string]: string }) {
    if (!window.confirm('Are you sure you want to update this entry? ')) {
      return;
    }
    this.applicationService.update(object.uuid, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  showDialog(object: ApplicationFormObject, title: string, fields: IFormGenerator[], decision: "approve" | "deny") {
    this.dialog.open(DialogFormComponent, {
      data: {
        fields, title, formType: "filter"
      },
      height: '90vh',
      width: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      const formData = data.reduce((acc: Record<string, any>, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {});
      this.submitFinish(object, decision, formData);

    })
  }

  submitFinish(object: ApplicationFormObject, decision: "approve" | "deny", formData: Record<string, any>) {
    this.applicationService.finish(object.uuid, decision, formData).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    });
  }

  finish(object: ApplicationFormObject, decision: "approve" | "deny") {

    if (!window.confirm(`Are you sure you want to ${decision} this application?`)) {
      return;
    }
    //get the config for the approval
    this.applicationService.getApplicationFormConfig(object.form_type, "finish").subscribe({
      next: response => {
        const data = response.data;
        if (data && data[decision] && data[decision]['additionalFields']) {
          this.showDialog(object, "Approve Application", data[decision]['additionalFields'], decision);
        }//no additional fields needed. Proceed to approve
        else {
          this.submitFinish(object, decision, {});
        }
      }, error: error => {
        this.submitFinish(object, decision, {});
      }
    });



  }

  setSelectedApplications(applications: ApplicationFormObject[]) {
    this.selectedApplications = applications;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
