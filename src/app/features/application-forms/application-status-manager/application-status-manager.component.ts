import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationFormService } from '../application-form.service';
import { ApplicationTemplateStageObject } from 'src/app/shared/types/application-template.model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { take } from 'rxjs';
import { ApplicationFormObject } from '../models/application-form.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-application-status-manager',
  templateUrl: './application-status-manager.component.html',
  styleUrls: ['./application-status-manager.component.scss']
})
export class ApplicationStatusManagerComponent implements OnChanges {
  @Input() applicationStatus: string = "";
  @Input() formType: string = "";
  allStatuses: ApplicationTemplateStageObject[] = [];
  loading: boolean = false;
  errorMessage: string = "";
  @Input() selectedApplications: ApplicationFormObject[] = [];
  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private service: ApplicationFormService,
    private authService: AuthService, public dialog: MatDialog, private notify: NotifyService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formType']) {
      this.loadStatuses();
    }
  }

  loadStatuses() {
    this.errorMessage = "";
    this.loading = true;
    this.service.getApplicationTemplateStatuses(this.formType).subscribe({
      next: response => {

        //get all statuses except the current status, and get the allowed transitions for the current status
        const otherStatuses = response.data.filter((status: ApplicationTemplateStageObject) => status.name !== this.applicationStatus);
        const currentStatus = response.data.find((status: ApplicationTemplateStageObject) => status.name === this.applicationStatus);
        if (currentStatus) {
          this.allStatuses = otherStatuses.filter((status: ApplicationTemplateStageObject) => currentStatus.allowedTransitions.includes(status.name));
          //filter out and show only the statuses that have the current user's role in the allowed roles.
          // we're changing how permissions for statuses are checked. We're now checking the user's role against the allowedUserRoles array in the status object.
          //in future a permission will be created for each status and stored against the user's role in the role_permissions table and the user's permissions will be checked against the status permission
          this.authService.getUser().pipe(take(1)).subscribe(user => {
            this.allStatuses = this.allStatuses.filter((status: ApplicationTemplateStageObject) => status.allowedUserRoles?.includes(user.role_name));
          });
        }
        else {
          this.errorMessage = "The current status is not found in the list of statuses. Please check the application template configuration";
        }

        this.loading = false;
      },
      error: error => {
        this.errorMessage = "An error occurred while fetching the statuses. Please try again later";
        this.loading = false;
      }
    })
  }
  showDialog(status: ApplicationTemplateStageObject) {
    const fields: IFormGenerator[] = [];
    status.actions.forEach(action => {
      if (action.type === "email") {
        fields.push({
          name: action.config.template,
          value: action.config.template,
          type: "text",
          label: action.config.template,
          hint: action.config.subject,
          options: [],
          required: true
        })
      }
    })
    //if the status has a config, get the config and show it in the dialog
    this.dialog.open(DialogFormComponent, {
      data: {
        fields,
        title: "",
        formType: "filter"
      },
      height: '90vh',
      width: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      const formData = data.reduce((acc: Record<string, any>, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {});
      // this.submitFinish(object, decision, formData);

    })
  }
  submitStatus(status: ApplicationTemplateStageObject) {
    if (!window.confirm(`Are you sure you want to change the status of the selected applications to ${status.name}?`)) {
      return;
    }
    this.notify.showLoading();
    this.service.updateApplicationsStatus(this.formType, this.selectedApplications.map(app => app.uuid), status.name).subscribe({
      next: response => {
        this.notify.successNotification(response.message)
        this.selectedApplications = [];
      },
      error: error => {

      },
      complete: () => {
        this.notify.hideLoading();
      }
    })
  }

  // changeStatus(status: string) {
  //   this.errorMessage = "";
  //   this.loading = true;
  //   this.service.changeApplicationStatus(this.selectedApplications.map(app => app.id), status).subscribe({
  //     next: response => {
  //       this.loading = false;
  //       this.loadStatuses();
  //     },
  //     error: error => {
  //       this.errorMessage = "An error occurred while changing the status. Please try again later";
  //       this.loading = false;
  //     }
  //   })
  // }

}
